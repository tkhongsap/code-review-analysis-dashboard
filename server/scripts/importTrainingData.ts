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
      const timeEstimate = trainingPlanEntries.reduce((sum, [_, score]) => sum + Number(score), 0);

      // Transform training plan entries into metrics for the spider chart
      const metrics = Object.fromEntries(
        trainingPlanEntries.map(([name, score]) => [
          name.toLowerCase().replace(/\s+/g, '_'),
          Number(score)
        ])
      );

      await db.insert(trainingRecommendations).values({
        standardized_category: item.standardized_category,
        training_query: item.training_analysis.training_query,
        training_plan: {
          metrics,
          recommendations: trainingPlanEntries.map(([name, score]) => 
            `${name} (Priority: ${score})`
          ),
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