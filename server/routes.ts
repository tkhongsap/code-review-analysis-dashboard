import type { Express } from "express";
import { createServer, type Server } from "http";
import { importCSVData } from "./services/import";
import { analyzeCodeReviews, generateTrainingRecommendations } from "./services/openai";
import path from "path";

export function registerRoutes(app: Express): Server {
  // API routes
  app.post("/api/import", async (req, res) => {
    try {
      const csvPath = path.join(process.cwd(), "attached_assets", "consolidated_with_llm_openai.csv");
      await importCSVData(csvPath);
      res.json({ success: true, message: "Data imported successfully" });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/analysis", async (req, res) => {
    try {
      const analysis = await analyzeCodeReviews();
      res.json(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/training/recommendations", async (req, res) => {
    try {
      const recommendations = await generateTrainingRecommendations(1);
      res.json(recommendations);
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}