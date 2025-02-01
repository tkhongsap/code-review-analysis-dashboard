import fs from "fs";
import { parse } from "csv-parse";
import { db } from "@db";
import { codeReviews } from "@db/schema";

export async function importCSVData(filePath: string) {
  try {
    const parser = fs.createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true
      })
    );

    for await (const record of parser) {
      await db.insert(codeReviews).values({
        filename: record.filename,
        rawCategory: record.raw_category,
        standardizedCategory: record.standardized_category,
        rawIntent: record.raw_intent,
        standardizedIntent: record.standardized_intent,
        relatedWorkAreas: record.related_work_areas?.split(",") || [],
        provider: record.provider,
        processedTimestamp: new Date(record.processed_timestamp),
        capabilityAnalysis: record.capability_analysis?.split(",") || [],
        suggestedTraining: record.suggested_training?.split(",") || []
      });
    }

    return { success: true, message: "Data import completed successfully" };
  } catch (error) {
    console.error("Error importing CSV data:", error);
    throw error;
  }
}
