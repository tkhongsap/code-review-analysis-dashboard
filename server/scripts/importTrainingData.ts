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
      // Extract the training plan entries
      const trainingPlan = item.training_analysis.training_plan;

      await db.insert(trainingRecommendations).values({
        standardized_category: item.standardized_category,
        training_query: item.training_analysis.training_query,
        training_plan: {
          // Store each recommendation as a point on the spider chart
          metrics: Object.fromEntries(
            Object.entries(trainingPlan).map(([name, priority]) => [
              // Keep the full name as the key
              name,
              // Convert priority to number
              Number(priority)
            ])
          ),
          // Store recommendations list
          recommendations: Object.entries(trainingPlan).map(([name, priority]) => 
            `${name} (Priority: ${priority})`
          ),
          timeEstimate: Object.values(trainingPlan)
            .reduce((sum, priority) => sum + Number(priority), 0)
        }
      });
    }

    console.log("Training recommendations data imported successfully");
  } catch (error) {
    console.error("Error importing training data:", error);
  }
}

importTrainingData();