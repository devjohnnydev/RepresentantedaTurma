import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";
import { authStorage } from "./replit_integrations/auth/storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // Middleware to check if user is admin
  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = await authStorage.getUser(req.user.claims.sub);
    // Auto-promote Professor Johnny (simple logic based on name or first user)
    // For now, let's just say if the name contains "Johnny" or it's the first user
    if (user && (user.firstName?.toLowerCase().includes("johnny") || user.email?.includes("johnny"))) {
      if (!user.isAdmin) {
         await storage.makeAdmin(user.id);
         user.isAdmin = true;
      }
    }
    
    if (!user?.isAdmin) return res.status(403).json({ message: "Forbidden" });
    next();
  };

  // --- Candidates ---
  app.get(api.candidates.list.path, async (req, res) => {
    const candidates = await storage.getCandidates();
    res.json(candidates);
  });

  app.post(api.candidates.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.candidates.create.input.parse(req.body);
      const candidate = await storage.createCandidate(input);
      res.status(201).json(candidate);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.patch(api.candidates.approve.path, requireAdmin, async (req, res) => {
    const candidate = await storage.approveCandidate(Number(req.params.id));
    res.json(candidate);
  });

  app.delete(api.candidates.delete.path, requireAdmin, async (req, res) => {
    await storage.deleteCandidate(Number(req.params.id));
    res.status(204).send();
  });

  // --- Votes ---
  app.get(api.votes.status.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.json({ hasVoted: false });
    const hasVoted = await storage.hasUserVoted(req.user!.claims.sub);
    res.json({ hasVoted });
  });

  app.post(api.votes.submit.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const userId = req.user!.claims.sub;
    const hasVoted = await storage.hasUserVoted(userId);
    if (hasVoted) return res.status(400).json({ message: "Already voted" });

    try {
      const { maleCandidateId, femaleCandidateId } = req.body;
      await storage.submitVote(userId, maleCandidateId, femaleCandidateId);
      res.json({ message: "Vote submitted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit vote" });
    }
  });

  // --- Settings ---
  app.get(api.settings.getPhase.path, async (req, res) => {
    const phase = await storage.getPhase();
    res.json({ phase });
  });

  app.post(api.settings.setPhase.path, requireAdmin, async (req, res) => {
    const { phase } = req.body;
    await storage.setPhase(phase);
    res.json({ phase });
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getCandidates();
  if (existing.length === 0) {
    console.log("Seeding candidates...");
    const candidates = [
      { name: "Carlos Silva", nickname: "Carlinhos", bio: "Focado em organização e eventos esportivos.", platform: "Mais esportes e lazer.", gender: "male" as const, approved: true },
      { name: "Pedro Santos", nickname: "Pedrão", bio: "Melhor comunicação com os professores.", platform: "Transparência total.", gender: "male" as const, approved: true },
      { name: "Lucas Ferreira", nickname: "Lukinhas", bio: "Inovação tecnológica na sala.", platform: "Hackathons mensais.", gender: "male" as const, approved: true },
      { name: "Ana Oliveira", nickname: "Aninha", bio: "Apoio aos estudos e grupos de monitoria.", platform: "Ninguém fica pra trás.", gender: "female" as const, approved: true },
      { name: "Mariana Costa", nickname: "Mari", bio: "Representatividade e inclusão.", platform: "Voz para todos.", gender: "female" as const, approved: true },
      { name: "Julia Souza", nickname: "Juju", bio: "Organização de festas e eventos culturais.", platform: "Mais cultura na escola.", gender: "female" as const, approved: true },
    ];

    for (const c of candidates) {
      const inserted = await storage.createCandidate(c);
      await storage.approveCandidate(inserted.id); // Ensure they are approved
    }
  }
}
