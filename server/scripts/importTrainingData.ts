import { db } from "@db";
import { trainingRecommendations } from "@db/schema";
import fs from "fs";
import path from "path";

async function importTrainingData() {
  try {
    const jsonData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "attached_assets", "training_recommendation_analysis.json"),
        "utf-8"
      )
    );

    // Clear existing data first
    await db.delete(trainingRecommendations);

    for (const item of jsonData) {
      const trainingPlanEntries = Object.entries(item.training_analysis.training_plan);
      const maxScore = 10; // Maximum score in the training plan

      // Create normalized metrics from training plan scores
      const metrics = {
        implementation: 80, // Base score
        theoretical: 60,   // Base score
        practical: 70,     // Base score
        complexity: 50,    // Base score
        impact: 90        // Base score
      };

      // Create recommendations list from training plan
      const recommendations = trainingPlanEntries.map(([name, score]) => ({
        name,
        priority: Number(score)
      }))
      .sort((a, b) => b.priority - a.priority)
      .map(({name, priority}) => `${name} (Priority: ${priority})`);

      // Calculate time estimate based on priorities
      const timeEstimate = trainingPlanEntries.reduce((sum, [_, score]) => sum + Number(score), 0);

      await db.insert(trainingRecommendations).values({
        standardized_category: item.standardized_category,
        training_query: item.training_analysis.training_query,
        training_plan: {
          metrics,
          recommendations,
          timeEstimate
        }
      });
    }

    console.log("Training recommendations data imported successfully");
  } catch (error) {
    console.error("Error importing training data:", error);
  }
}

importTrainingData();