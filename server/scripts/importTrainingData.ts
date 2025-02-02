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

    for (const item of jsonData) {
      // Calculate metrics based on the training plan priorities
      const trainingPlanValues = Object.entries(item.training_analysis.training_plan);
      const maxPriority = Math.max(...trainingPlanValues.map(([_, priority]) => priority));

      // Create metrics based on the training plan distribution
      const metrics = {
        implementation: Math.round((trainingPlanValues[0][1] / maxPriority) * 100),
        theoretical: Math.round((trainingPlanValues[1][1] / maxPriority) * 100),
        practical: Math.round((trainingPlanValues[2][1] / maxPriority) * 100),
        complexity: Math.round((trainingPlanValues[3][1] / maxPriority) * 100),
        impact: Math.round((trainingPlanValues[4][1] / maxPriority) * 100)
      };

      // Create recommendations from the training plan
      const recommendations = trainingPlanValues.map(([name, priority]) => 
        `${name} (Priority: ${priority})`
      );

      await db.insert(trainingRecommendations).values({
        standardized_category: item.standardized_category,
        training_query: item.training_analysis.training_query,
        training_plan: {
          metrics,
          recommendations,
          timeEstimate: Object.values(item.training_analysis.training_plan).reduce((a, b) => a + b, 0)
        },
      });
    }

    console.log("Training recommendations data imported successfully");
  } catch (error) {
    console.error("Error importing training data:", error);
  }
}

importTrainingData();