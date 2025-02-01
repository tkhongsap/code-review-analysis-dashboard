import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Simple intents table for broader categories
export const intents = pgTable("intents", {
  id: serial("id").primaryKey(),
  standardizedCategory: text("standardized_category").notNull().unique(),
  broaderCategories: text("broader_categories").notNull(),
});

// Export schemas for validation
export const insertIntentSchema = createInsertSchema(intents);
export const selectIntentSchema = createSelectSchema(intents);
export type InsertIntent = typeof intents.$inferInsert;
export type SelectIntent = typeof intents.$inferSelect;