import type { Express } from "express";
import { createServer, type Server } from "http";
import { importJSONData } from "./services/import";
import { db } from "@db";
import { intents } from "@db/schema";
import { desc, sql } from "drizzle-orm";
import { join } from "path";

export function registerRoutes(app: Express): Server {
  // Import intent keywords route
  app.post("/api/import/intent-keywords", async (req, res) => {
    try {
      const jsonPath = join(process.cwd(), "attached_assets", "intent_broader_categories.json");
      console.log("Attempting to import intent broader categories from:", jsonPath);
      const result = await importJSONData(jsonPath);
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/intents", async (req, res) => {
    try {
      const intentStats = await db.select({
        category: intents.standardizedCategory,
        broaderCategories: intents.broaderCategories,
      })
      .from(intents)
      .orderBy(desc(intents.id));

      const total = await db.select({
        count: sql<number>`count(*)`
      }).from(intents);

      const distribution = intentStats.map((stat, index) => ({
        category: stat.category,
        count: index + 1,
        percentage: Math.round(((index + 1) / total[0].count) * 100)
      }));

      const insights = intentStats.map(stat => ({
        intent: stat.category,
        broaderCategories: stat.broaderCategories.split(',').map(cat => cat.trim()),
        description: `This category encompasses: ${stat.broaderCategories}`
      }));

      res.json({
        distribution: distribution.slice(0, 10),
        insights: insights.slice(0, 10),
        topKeywords: insights
          .flatMap(insight => insight.broaderCategories)
          .slice(0, 20)
          .map((keyword, index) => ({
            keyword,
            count: total[0].count - index,
            percentage: Math.round(((total[0].count - index) / total[0].count) * 100)
          }))
      });
    } catch (error) {
      console.error("Intent analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}