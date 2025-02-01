import type { Express } from "express";
import { createServer, type Server } from "http";
import { importJSONData } from "./services/import";
import { db } from "@db";
import { codeReviews, categories, intents, workAreas, trainingRecommendations } from "@db/schema";
import { desc, sql } from "drizzle-orm";
import { join } from "path";

export function registerRoutes(app: Express): Server {
  // API routes
  app.post("/api/import", async (req, res) => {
    try {
      console.log("Current working directory:", process.cwd());
      const jsonPath = join(process.cwd(), "attached_assets", "consolidated_with_llm_openai.json");
      console.log("Attempting to import JSON from:", jsonPath);
      const result = await importJSONData(jsonPath);
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/metrics", async (req, res) => {
    try {
      const totalReviews = await db.select({ 
        count: sql<number>`count(*)` 
      }).from(codeReviews);

      const uniqueCategories = await db.select({ 
        count: sql<number>`count(distinct standardized_category)` 
      }).from(codeReviews);

      const uniqueWorkAreas = await db.select({ 
        count: sql<number>`count(distinct unnest(related_work_areas))` 
      }).from(codeReviews);

      res.json({
        totalReviews: totalReviews[0].count,
        uniqueCategories: uniqueCategories[0].count,
        uniqueWorkAreas: uniqueWorkAreas[0].count,
        totalTrainingCourses: uniqueCategories[0].count * 6 // Approximate based on categories
      });
    } catch (error) {
      console.error("Metrics error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/categories", async (req, res) => {
    try {
      const categoryCounts = await db.select({
        name: codeReviews.standardizedCategory,
        count: sql<number>`count(*)`,
      })
      .from(codeReviews)
      .groupBy(codeReviews.standardizedCategory)
      .orderBy(sql`count(*) desc`)
      .limit(4);

      const insights = await db.select({
        insight: sql<string>`concat(standardized_category, ' makes up ', 
          round(count(*)::numeric / sum(count(*)) over() * 100), '% of all analysis')`
      })
      .from(codeReviews)
      .groupBy(codeReviews.standardizedCategory)
      .orderBy(sql`count(*) desc`)
      .limit(3);

      const distribution = categoryCounts.map(cat => ({
        name: cat.name || 'Unknown',
        value: cat.count,
        trend: Math.floor(Math.random() * 20) - 5, // Random trend for demo
        description: `${cat.name || 'Unknown'} related reviews`
      }));

      res.json({
        distribution,
        insights: insights.map(i => i.insight),
        topCategories: categoryCounts.map(cat => ({
          name: cat.name || 'Unknown',
          count: cat.count
        }))
      });
    } catch (error) {
      console.error("Category analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/workareas", async (req, res) => {
    try {
      const workAreaStats = await db.select({
        workArea: sql<string>`unnest(related_work_areas)`,
        count: sql<number>`count(*)`
      })
      .from(codeReviews)
      .groupBy(sql`unnest(related_work_areas)`)
      .orderBy(sql`count(*) desc`)
      .limit(5);

      const totalReviews = await db.select({
        count: sql<number>`count(*)`
      }).from(codeReviews);

      const distribution = workAreaStats.map(stat => ({
        name: stat.workArea,
        percentage: Math.round((stat.count / totalReviews[0].count) * 100),
        relatedCategories: ['Frontend', 'Backend', 'DevOps'] // Simplified for demo
      }));

      res.json({
        distribution,
        skillsAnalysis: workAreaStats.map(stat => ({
          name: stat.workArea,
          level: stat.count > 100 ? "Advanced" : stat.count > 50 ? "Intermediate" : "Beginner",
          proficiency: Math.min(100, Math.round((stat.count / totalReviews[0].count) * 200)),
          description: `Expertise in ${stat.workArea}`
        })),
        crossFunctional: workAreaStats.slice(0, 3).map(stat => ({
          name: stat.workArea,
          connections: Math.floor(Math.random() * 5) + 2,
          connectedAreas: workAreaStats
            .filter(other => other.workArea !== stat.workArea)
            .slice(0, 3)
            .map(other => other.workArea)
        }))
      });
    } catch (error) {
      console.error("Work area analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/queries", async (req, res) => {
    try {
      const queryStats = await db.select({
        category: codeReviews.standardizedCategory,
        count: sql<number>`count(*)`
      })
      .from(codeReviews)
      .groupBy(codeReviews.standardizedCategory)
      .orderBy(sql`count(*) desc`)
      .limit(5);

      const maxCount = Math.max(...queryStats.map(q => q.count));

      res.json({
        distribution: queryStats.map(stat => ({
          category: stat.category || 'Unknown',
          value: Math.round((stat.count / maxCount) * 100)
        })),
        categories: queryStats.map(stat => ({
          name: stat.category || 'Unknown',
          count: stat.count,
          description: `Questions about ${(stat.category || 'unknown').toLowerCase()}`
        })),
        insights: [
          {
            title: "Common Patterns",
            description: `${queryStats[0]?.category || 'Unknown'} is the most frequent query category`
          },
          {
            title: "Emerging Trends",
            description: `Growing focus on ${queryStats[1]?.category || 'Unknown'}`
          }
        ]
      });
    } catch (error) {
      console.error("Query analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/training", async (req, res) => {
    try {
      const skillStats = await db.select({
        skill: sql<string>`unnest(capability_analysis)`,
        count: sql<number>`count(*)`
      })
      .from(codeReviews)
      .groupBy(sql`unnest(capability_analysis)`)
      .orderBy(sql`count(*) desc`)
      .limit(5);

      const totalReviews = await db.select({
        count: sql<number>`count(*)`
      }).from(codeReviews);

      const recommendations = skillStats.map(stat => ({
        course: `Advanced ${stat.skill}`,
        priority: stat.count > 100 ? "High" : "Medium",
        category: stat.skill.split(" ")[0],
        description: `Master ${stat.skill.toLowerCase()}`,
        impactScore: Math.min(100, Math.round((stat.count / totalReviews[0].count) * 200))
      }));

      res.json({
        recommendations,
        skillGaps: skillStats.map(stat => ({
          skill: stat.skill,
          level: stat.count > 100 ? "Advanced" : "Intermediate",
          currentProficiency: Math.round((stat.count / totalReviews[0].count) * 100),
          requiredProficiency: Math.min(100, Math.round((stat.count / totalReviews[0].count) * 150))
        })),
        learningPaths: [
          {
            name: "Frontend Master",
            duration: "3 months",
            description: "Comprehensive frontend development path",
            skills: skillStats.slice(0, 3).map(s => s.skill)
          },
          {
            name: "Backend Expert",
            duration: "4 months",
            description: "Advanced backend development curriculum",
            skills: skillStats.slice(2, 5).map(s => s.skill)
          }
        ]
      });
    } catch (error) {
      console.error("Training recommendations error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}