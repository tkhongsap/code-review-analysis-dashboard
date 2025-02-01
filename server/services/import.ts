import { createReadStream, existsSync, readFileSync } from 'fs';
import { parse } from "csv-parse";
import { db } from "@db";
import { codeReviews, intents } from "@db/schema";
import { eq } from 'drizzle-orm';

export async function importJSONData(filePath: string) {
  try {
    // First check if file exists
    if (!existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      throw new Error(`JSON file not found at path: ${filePath}`);
    }

    console.log(`Starting import of JSON file from: ${filePath}`);

    // Read and parse JSON file
    const jsonData = JSON.parse(readFileSync(filePath, 'utf-8'));
    let importedCount = 0;
    const errors: string[] = [];

    // If the file is intent_keywords.json, handle it differently
    if (filePath.includes('intent_keywords.json')) {
      // First clear existing intents
      await db.delete(intents);

      for (const record of jsonData) {
        try {
          const standardizedIntent = record.standardized_intent.replace(/^"|"$/g, '');
          const keywordsList = record.keywords.split(", ").filter(Boolean);

          await db.insert(intents).values({
            name: standardizedIntent,
            standardizedIntent: standardizedIntent,
            keywords: keywordsList,
            count: 1, // Initial count
            frequency: keywordsList.length > 5 ? 'high' : 'medium',
            description: `Intent related to ${standardizedIntent}`
          });
          importedCount++;
        } catch (recordError: any) {
          console.error(`Error importing intent record: ${record.standardized_intent}`, recordError);
          errors.push(`Failed to import ${record.standardized_intent}: ${recordError.message}`);
        }
      }
    } else {
      // Handle code reviews import as before
      for (const record of jsonData) {
        try {
          const relatedWorkAreas = record.related_work_areas ? 
            (typeof record.related_work_areas === 'string' ? 
              record.related_work_areas.split(",") : 
              record.related_work_areas
            ).map((area: string) => area.trim()).filter(Boolean) : 
            [];

          const capabilityAnalysis = record.capability_analysis ? 
            (Array.isArray(record.capability_analysis) ? 
              record.capability_analysis : 
              record.capability_analysis.split(",")
            ).map((cap: string) => cap.trim()).filter(Boolean) : 
            [];

          const suggestedTraining = record.suggested_training ? 
            (Array.isArray(record.suggested_training) ? 
              record.suggested_training : 
              record.suggested_training.split(",")
            ).map((training: string) => training.trim()).filter(Boolean) : 
            [];

          await db.insert(codeReviews).values({
            filename: record.filename,
            rawCategory: record.raw_category,
            standardizedCategory: record.standardized_category,
            rawIntent: record.raw_intent,
            standardizedIntent: record.standardized_intent,
            relatedWorkAreas,
            provider: record.provider,
            processedTimestamp: new Date(record.processed_timestamp),
            capabilityAnalysis,
            suggestedTraining
          });
          importedCount++;
        } catch (recordError: any) {
          console.error(`Error importing record: ${record.filename}`, recordError);
          errors.push(`Failed to import ${record.filename}: ${recordError.message}`);
        }
      }
    }

    console.log(`Import completed. Successfully imported ${importedCount} records`);
    if (errors.length > 0) {
      console.log(`Encountered ${errors.length} errors during import`);
    }

    return {
      success: true,
      message: `Successfully imported ${importedCount} records`,
      count: importedCount,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error("Error importing JSON data:", error);
    throw error;
  }
}

export async function importCSVData(filePath: string) {
  try {
    // First check if file exists
    if (!existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      throw new Error(`CSV file not found at path: ${filePath}`);
    }

    console.log(`Starting import of CSV file from: ${filePath}`);

    // Create parser with strict mode
    const parser = createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      })
    );

    let importedCount = 0;
    const errors: string[] = [];

    for await (const record of parser) {
      try {
        // Clean and prepare the data
        const relatedWorkAreas = record.related_work_areas ? 
          record.related_work_areas.split(",").map((area: string) => area.trim()).filter(Boolean) : 
          [];

        const capabilityAnalysis = record.capability_analysis ? 
          record.capability_analysis.split(",").map((cap: string) => cap.trim()).filter(Boolean) : 
          [];

        const suggestedTraining = record.suggested_training ? 
          record.suggested_training.split(",").map((training: string) => training.trim()).filter(Boolean) : 
          [];

        await db.insert(codeReviews).values({
          filename: record.filename,
          rawCategory: record.raw_category,
          standardizedCategory: record.standardized_category,
          rawIntent: record.raw_intent,
          standardizedIntent: record.standardized_intent,
          relatedWorkAreas,
          provider: record.provider,
          processedTimestamp: new Date(record.processed_timestamp),
          capabilityAnalysis,
          suggestedTraining
        });
        importedCount++;
      } catch (recordError: any) {
        console.error(`Error importing record: ${record.filename}`, recordError);
        errors.push(`Failed to import ${record.filename}: ${recordError.message}`);
      }
    }

    console.log(`Import completed. Successfully imported ${importedCount} records`);
    if (errors.length > 0) {
      console.log(`Encountered ${errors.length} errors during import`);
    }

    return {
      success: true,
      message: `Successfully imported ${importedCount} records`,
      count: importedCount,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error("Error importing CSV data:", error);
    throw error;
  }
}