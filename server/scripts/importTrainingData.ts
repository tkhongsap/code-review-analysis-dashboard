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
      await db.insert(trainingRecommendations).values({
        standardized_category: item.standardized_category,
        training_query: item.training_analysis.training_query,
        training_plan: item.training_analysis.training_plan,
      });
    }

    console.log("Training recommendations data imported successfully");
  } catch (error) {
    console.error("Error importing training data:", error);
  }
}

importTrainingData();