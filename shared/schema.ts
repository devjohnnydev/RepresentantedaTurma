import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// Settings table for managing election phases
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

// Candidates table
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nickname: text("nickname").notNull(),
  bio: text("bio").notNull(),
  platform: text("platform").notNull(), // "Why I should be representative"
  photoUrl: text("photo_url"),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  approved: boolean("approved").default(false),
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Votes table to track who voted for whom
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Foreign key to auth users
  candidateId: integer("candidate_id").notNull().references(() => candidates.id),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertCandidateSchema = createInsertSchema(candidates).omit({ 
  id: true, 
  votes: true, 
  createdAt: true, 
  approved: true 
});

export const voteSchema = createInsertSchema(votes).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof voteSchema>;

// API Types
export type Phase = "registration" | "voting" | "results";

export type VoteRequest = {
  maleCandidateId: number;
  femaleCandidateId: number;
};

export type ElectionState = {
  phase: Phase;
  hasVoted: boolean;
  isAdmin: boolean;
};
