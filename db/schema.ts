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

// User capabilities table
export const userCapabilities = pgTable("user_capabilities", {
  id: serial("id").primaryKey(),
  standardizedCategory: text("standardized_category").notNull(),
  userQuery: text("user_query").notNull(),
  capabilities: jsonb("capabilities").notNull(),
});

// Intents table
export const intents = pgTable("intents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  keywords: text("keywords").array().notNull(),
  count: integer("count").notNull().default(0),
  frequency: text("frequency"),
  description: text("description"),
});

// Intent broader categories table
export const intentBroaderCategories = pgTable("intent_broader_categories", {
  id: serial("id").primaryKey(),
  standardizedCategory: text("standardized_category").notNull().unique(),
  broaderCategories: text("broader_categories").notNull(),
});

// Work area broader categories table
export const workAreaBroaderCategories = pgTable("work_area_broader_categories", {
  id: serial("id").primaryKey(),
  standardizedCategory: text("standardized_category").notNull().unique(),
  broaderWorkAreas: text("broader_work_areas").notNull(),
});

// Training recommendations table
export const trainingRecommendations = pgTable("training_recommendations", {
  id: serial("id").primaryKey(),
  standardized_category: text("standardized_category").notNull(),
  training_query: text("training_query").notNull(),
  training_plan: jsonb("training_plan").notNull(),
});


// Export schemas for validation
export const insertUserCapabilitySchema = createInsertSchema(userCapabilities);
export const selectUserCapabilitySchema = createSelectSchema(userCapabilities);
export type InsertUserCapability = typeof userCapabilities.$inferInsert;
export type SelectUserCapability = typeof userCapabilities.$inferSelect;

export const insertCodeReviewSchema = createInsertSchema(codeReviews);
export const selectCodeReviewSchema = createSelectSchema(codeReviews);
export type InsertCodeReview = typeof codeReviews.$inferInsert;
export type SelectCodeReview = typeof codeReviews.$inferSelect;

export const insertTrainingRecommendationSchema = createInsertSchema(trainingRecommendations);
export const selectTrainingRecommendationSchema = createSelectSchema(trainingRecommendations);
export type InsertTrainingRecommendation = typeof trainingRecommendations.$inferInsert;
export type SelectTrainingRecommendation = typeof trainingRecommendations.$inferSelect;

// Relations
export const codeReviewsRelations = relations(codeReviews, ({ many }) => ({
  intents: many(intents),
}));

// Relation between intents and broader categories
export const intentRelations = relations(intents, ({ one }) => ({
  broaderCategory: one(intentBroaderCategories, {
    fields: [intents.name],
    references: [intentBroaderCategories.standardizedCategory],
  }),
}));