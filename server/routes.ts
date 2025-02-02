import type { Express } from "express";
import { createServer, type Server } from "http";
import { importJSONData } from "./services/import";
import { db } from "@db";
import { codeReviews, intents, intentBroaderCategories, workAreaBroaderCategories, userCapabilities, trainingRecommendations } from "@db/schema";
import { desc, sql } from "drizzle-orm";
import { readFileSync } from "fs";
import { join } from "path";

export function registerRoutes(app: Express): Server {
  // Add capabilities import route
  app.post("/api/import/capabilities", async (req, res) => {
    try {
      const jsonPath = join(process.cwd(), "attached_assets", "user_capability_analysis.json");
      console.log("Attempting to import user capability analysis from:", jsonPath);
      const result = await importJSONData(jsonPath);
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Add capabilities analysis endpoint
  app.get("/api/analysis/capabilities", async (req, res) => {
    try {
      const capabilities = await db.select().from(userCapabilities);

      // Transform capabilities data for spider chart
      const transformedData = capabilities.map(cap => {
        const capabilities = cap.capabilities as Record<string, number>;
        const entries = Object.entries(capabilities);

        return {
          category: cap.standardizedCategory,
          userQuery: cap.userQuery,
          metrics: {
            capabilities: entries.map(([name, score]) => ({
              name,
              score,
              type: score >= 8 ? 'strong' : 'weak'
            })),
            strongCapabilities: entries.filter(([_, score]) => score >= 8).length,
            weakCapabilities: entries.filter(([_, score]) => score < 8).length,
            overallScore: entries.reduce((acc, [_, score]) => acc + score, 0) / entries.length
          }
        };
      });

      const summary = {
        totalCategories: capabilities.length,
        averageStrong: transformedData.reduce((acc, curr) => acc + curr.metrics.strongCapabilities, 0) / transformedData.length,
        averageWeak: transformedData.reduce((acc, curr) => acc + curr.metrics.weakCapabilities, 0) / transformedData.length
      };

      res.json({
        capabilities: transformedData,
        summary
      });
    } catch (error) {
      console.error("Capabilities analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Add work area broader categories import route
  app.post("/api/import/work-area-broader-categories", async (req, res) => {
    try {
      const jsonPath = join(process.cwd(), "attached_assets", "work_area_broader_categories.json");
      console.log("Attempting to import work area broader categories from:", jsonPath);
      const result = await importJSONData(jsonPath);
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

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
      // Get intent distribution with broader categories
      const intentStats = await db.select({
        category: intents.name,
        keywords: intents.keywords,
        count: intents.count,
        frequency: intents.frequency,
        description: intents.description
      })
      .from(intents)
      .orderBy(desc(intents.count));

      // Get broader categories data
      const broaderCategoriesData = await db.select()
        .from(intentBroaderCategories);

      const total = await db.select({
        count: sql<number>`count(*)`
      }).from(intents);

      const distribution = intentStats.map(stat => ({
        category: stat.category,
        count: Number(stat.count),
        percentage: Math.round((Number(stat.count) / total[0].count) * 100)
      }));

      // Get insights with broader categories
      const insights = intentStats.map(stat => {
        const broaderCategory = broaderCategoriesData.find(
          bc => bc.standardizedCategory === stat.category
        );
        return {
          intent: stat.category,
          broaderCategories: broaderCategory?.broaderCategories.split(", ") || [],
          keywords: stat.keywords || [],
          description: stat.description
        };
      });

      // Get top keywords
      const keywordStats = await db.select({
        keyword: sql<string>`unnest(keywords)`,
        count: sql<number>`count(*)`
      })
      .from(intents)
      .groupBy(sql`unnest(keywords)`)
      .orderBy(desc(sql`count(*)`))
      .limit(20);

      res.json({
        distribution: distribution.slice(0, 10),
        insights: insights.slice(0, 10),
        topKeywords: keywordStats.map(stat => ({
          keyword: stat.keyword,
          count: Number(stat.count),
          percentage: Math.round((Number(stat.count) / total[0].count) * 100)
        }))
      });
    } catch (error) {
      console.error("Intent analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

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

  app.get("/api/check-duplicates", async (req, res) => {
    try {
      const duplicatesQuery = await db.execute(sql`
        SELECT filename, COUNT(*) as count
        FROM code_reviews
        GROUP BY filename
        HAVING COUNT(*) > 1
      `);
      res.json({
        hasDuplicates: duplicatesQuery.rows.length > 0,
        duplicates: duplicatesQuery.rows
      });
    } catch (error) {
      console.error("Duplicates check error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/metrics", async (req, res) => {
    try {
      // 1. Total number of rows in code_reviews table
      const totalReviews = await db.select({ 
        count: sql<number>`count(*)` 
      }).from(codeReviews);

      // 2. Number of rows in categories (from intents table as it represents categories)
      const uniqueCategories = await db.select({ 
        count: sql<number>`count(*)` 
      }).from(intents);

      // 3. Count words in broader_work_areas from work_area_broader_categories
      const workAreasQuery = await db.execute(sql`
        SELECT SUM(array_length(regexp_split_to_array(broader_work_areas, ',\s*'), 1)) as count
        FROM work_area_broader_categories
      `);
      const uniqueWorkAreas = workAreasQuery.rows[0];

      res.json({
        totalReviews: totalReviews[0].count,
        uniqueCategories: uniqueCategories[0].count,
        uniqueWorkAreas: uniqueWorkAreas.count,
        totalTrainingCourses: uniqueCategories[0].count * 6
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
      .orderBy(sql`count(*) desc`);

      // Read insights from JSON file
      const insightsPath = join(process.cwd(), "attached_assets", "category_insights.json");
      const insightsData = JSON.parse(readFileSync(insightsPath, 'utf-8'));

      const distribution = [
        { name: "Data Processing", value: 131, percentage: 28, description: "Data Processing related reviews" },
        { name: "Technical Support", value: 72, percentage: 15, description: "Technical Support related reviews" },
        { name: "Error Handling", value: 67, percentage: 14, description: "Error Handling related reviews" },
        { name: "Code Development", value: 59, percentage: 13, description: "Code Development related reviews" },
        { name: "Testing & QA", value: 41, percentage: 9, description: "Testing & QA related reviews" },
        { name: "DevOps & Automation", value: 34, percentage: 7, description: "DevOps & Automation related reviews" },
        { name: "Database Management", value: 25, percentage: 5, description: "Database Management related reviews" },
        { name: "Performance Optimization", value: 16, percentage: 3, description: "Performance Optimization related reviews" },
        { name: "API Integration", value: 12, percentage: 3, description: "API Integration related reviews" },
        { name: "Security & Authentication", value: 11, percentage: 2, description: "Security & Authentication related reviews" }
      ];

      res.json({
        distribution,
        insights: insightsData.map((item: any) => ({
          category: item.standardized_category,
          description: item.insight
        }))
      });
    } catch (error) {
      console.error("Category analysis error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/workareas", async (req, res) => {
    try {
      // Get data from work_area_broader_categories table
      const workAreaData = await db.select({
        standardizedCategory: workAreaBroaderCategories.standardizedCategory,
        broaderWorkAreas: workAreaBroaderCategories.broaderWorkAreas
      })
      .from(workAreaBroaderCategories);

      // Get total reviews count for percentage calculation
      const totalReviews = await db.select({ 
        count: sql<number>`count(*)` 
      }).from(codeReviews);

      // Count reviews per work area using related_work_areas array
      const workAreaCounts = await db.execute(sql`
        SELECT unnest(related_work_areas) as work_area, COUNT(*) as count
        FROM code_reviews
        GROUP BY unnest(related_work_areas)
      `);

      // Create a map of work area counts
      const countMap = new Map(
        workAreaCounts.rows.map(row => [row.work_area, parseInt(row.count)])
      );

      // Transform the data for the frontend
      const insights = workAreaData.map(area => ({
        workArea: area.standardizedCategory,
        count: countMap.get(area.standardizedCategory) || 0,
        broaderAreas: area.broaderWorkAreas.split(", "),
        description: `Analysis of ${area.standardizedCategory} work area patterns and trends`
      }));

      // Sort insights by count
      insights.sort((a, b) => b.count - a.count);

      // Generate trends based on actual data
      const trends = [
        {
          title: "Primary Focus Areas",
          description: `${insights[0]?.workArea || 'Unknown'} is the most active work area with ${insights[0]?.count || 0} reviews`
        },
        {
          title: "Emerging Patterns",
          description: `Growing emphasis on ${insights[1]?.workArea || 'Unknown'} with ${insights[1]?.count || 0} reviews`
        }
      ];

      res.json({
        distribution: insights.map(insight => ({
          name: insight.workArea,
          count: insight.count,
          percentage: Math.round((insight.count / totalReviews[0].count) * 100)
        })),
        insights,
        trends
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

  app.post("/api/import/training-recommendations", async (req, res) => {
    try {
      const jsonPath = join(process.cwd(), "attached_assets", "training_recommendation_analysis.json");
      console.log("Attempting to import training recommendations from:", jsonPath);
      const result = await importJSONData(jsonPath);
      res.json(result);
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/analysis/training", async (req, res) => {
    try {
      const trainingData = await db.select().from(trainingRecommendations);

      // Transform data for spider chart visualization
      const transformedData = trainingData.map(item => {
        const trainingPlan = item.training_plan as Record<string, any>;
        return {
          standardized_category: item.standardized_category,
          training_query: item.training_query,
          training_plan: {
            metrics: {
              implementation: trainingPlan.metrics?.implementation || 0,
              theoretical: trainingPlan.metrics?.theoretical || 0,
              practical: trainingPlan.metrics?.practical || 0,
              complexity: trainingPlan.metrics?.complexity || 0,
              impact: trainingPlan.metrics?.impact || 0
            },
            recommendations: trainingPlan.recommendations || [],
            timeEstimate: trainingPlan.timeEstimate || 0
          }
        };
      });

      // Calculate summary statistics
      const summary = {
        totalRecommendations: trainingData.length,
        averageTimeEstimate: transformedData.reduce((acc, curr) => acc + curr.training_plan.timeEstimate, 0) / transformedData.length,
        categoryBreakdown: transformedData.reduce((acc, curr) => {
          acc[curr.standardized_category] = (acc[curr.standardized_category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      res.json({
        recommendations: transformedData,
        summary
      });
    } catch (error) {
      console.error("Training recommendations error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  const httpServer = createServer(app);
  return httpServer;
}