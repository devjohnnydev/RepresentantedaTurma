import { 
  candidates, votes, settings, users,
  type Candidate, type InsertCandidate, type Vote, type InsertVote, type Phase, type User 
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and } from "drizzle-orm";

export interface IStorage {
  // Settings
  getPhase(): Promise<Phase>;
  setPhase(phase: Phase): Promise<void>;

  // Candidates
  getCandidates(): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  approveCandidate(id: number): Promise<Candidate | undefined>;
  deleteCandidate(id: number): Promise<void>;
  
  // Votes
  hasUserVoted(userId: string): Promise<boolean>;
  submitVote(userId: string, maleCandidateId: number, femaleCandidateId: number): Promise<void>;
  getResults(): Promise<{ candidateId: number; votes: number }[]>;

  // Admin helper
  makeAdmin(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPhase(): Promise<Phase> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, "phase"));
    return (setting?.value as Phase) || "registration";
  }

  async setPhase(phase: Phase): Promise<void> {
    await db.insert(settings)
      .values({ key: "phase", value: phase })
      .onConflictDoUpdate({ target: settings.key, set: { value: phase } });
  }

  async getCandidates(): Promise<Candidate[]> {
    return await db.select().from(candidates).orderBy(candidates.name);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db.insert(candidates).values(insertCandidate).returning();
    return candidate;
  }

  async approveCandidate(id: number): Promise<Candidate | undefined> {
    const [candidate] = await db.update(candidates)
      .set({ approved: true })
      .where(eq(candidates.id, id))
      .returning();
    return candidate;
  }

  async deleteCandidate(id: number): Promise<void> {
    await db.delete(candidates).where(eq(candidates.id, id));
  }

  async hasUserVoted(userId: string): Promise<boolean> {
    const [vote] = await db.select().from(votes).where(eq(votes.userId, userId)).limit(1);
    return !!vote;
  }

  async submitVote(userId: string, maleCandidateId: number, femaleCandidateId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Insert male vote
      await tx.insert(votes).values({
        userId,
        candidateId: maleCandidateId,
        gender: "male"
      });
      // Increment male candidate count
      await tx.update(candidates)
        .set({ votes: sql`${candidates.votes} + 1` })
        .where(eq(candidates.id, maleCandidateId));

      // Insert female vote
      await tx.insert(votes).values({
        userId,
        candidateId: femaleCandidateId,
        gender: "female"
      });
      // Increment female candidate count
      await tx.update(candidates)
        .set({ votes: sql`${candidates.votes} + 1` })
        .where(eq(candidates.id, femaleCandidateId));
    });
  }

  async getResults(): Promise<{ candidateId: number; votes: number }[]> {
    const allCandidates = await db.select().from(candidates);
    return allCandidates.map(c => ({ candidateId: c.id, votes: c.votes || 0 }));
  }

  async makeAdmin(userId: string): Promise<void> {
    await db.update(users).set({ isAdmin: true }).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
