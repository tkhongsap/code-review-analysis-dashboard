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

// Intents table with broader categories
export const intents = pgTable("intents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  broaderCategories: text("broader_categories").notNull(),
  keywords: text("keywords").array().notNull(),
  count: integer("count").notNull().default(0),
  frequency: text("frequency"),
  description: text("description"),
});

// Export schemas for validation
export const insertCodeReviewSchema = createInsertSchema(codeReviews);
export const selectCodeReviewSchema = createSelectSchema(codeReviews);
export type InsertCodeReview = typeof codeReviews.$inferInsert;
export type SelectCodeReview = typeof codeReviews.$inferSelect;

// Relations
export const codeReviewsRelations = relations(codeReviews, ({ many }) => ({
  intents: many(intents),
}));