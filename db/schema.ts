import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Main code reviews table
export const codeReviews = pgTable("code_reviews", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  rawCategory: text("raw_category"),
  standardizedCategory: text("standardized_category"),
  rawIntent: text("raw_intent"),
  standardizedIntent: text("standardized_intent"),
  relatedWorkAreas: text("related_work_areas").array(),
  provider: text("provider"),
  processedTimestamp: timestamp("processed_timestamp"),
  capabilityAnalysis: text("capability_analysis").array(),
  suggestedTraining: text("suggested_training").array(),
});

// Categories analysis
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  count: integer("count").notNull().default(0),
  trend: integer("trend").notNull().default(0),
  description: text("description"),
});

// Intents analysis
export const intents = pgTable("intents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  count: integer("count").notNull().default(0),
  frequency: text("frequency"),
  description: text("description"),
});

// Work areas
export const workAreas = pgTable("work_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  percentage: integer("percentage").notNull().default(0),
  relatedCategories: text("related_categories").array(),
  skillLevel: text("skill_level"),
  proficiency: integer("proficiency").notNull().default(0),
});

// Training recommendations
export const trainingRecommendations = pgTable("training_recommendations", {
  id: serial("id").primaryKey(),
  course: text("course").notNull(),
  priority: text("priority").notNull(),
  category: text("category"),
  description: text("description"),
  impactScore: integer("impact_score").notNull().default(0),
});

// Export schemas for validation
export const insertCodeReviewSchema = createInsertSchema(codeReviews);
export const selectCodeReviewSchema = createSelectSchema(codeReviews);
export type InsertCodeReview = typeof codeReviews.$inferInsert;
export type SelectCodeReview = typeof codeReviews.$inferSelect;

// Relations
export const codeReviewsRelations = relations(codeReviews, ({ many }) => ({
  categories: many(categories),
  intents: many(intents),
  workAreas: many(workAreas),
  trainingRecommendations: many(trainingRecommendations),
}));