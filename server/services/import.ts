import { createReadStream, existsSync, readFileSync } from 'fs';
import { parse } from "csv-parse";
import { db } from "@db";
import { codeReviews, intents, intentBroaderCategories, workAreaBroaderCategories, userCapabilities } from "@db/schema";
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

    // Handle different types of imports based on file content
    if (filePath.includes('user_capability_analysis.json')) {
      console.log('Processing user capability analysis data');

      try {
        // Clear existing capability data
        await db.delete(userCapabilities);
        console.log('Cleared existing user capabilities data');

        for (const record of jsonData) {
          try {
            const standardizedCategory = record.standardized_category;
            const capabilityAnalysis = record.capability_analysis;

            if (!standardizedCategory || !capabilityAnalysis) {
              console.error('Missing required fields in record:', record);
              throw new Error('Missing required fields');
            }

            console.log(`Importing capability analysis for category: ${standardizedCategory}`);

            await db.insert(userCapabilities).values({
              standardizedCategory,
              userQuery: capabilityAnalysis.user_query || null,
              strongCapabilities: capabilityAnalysis.strong_capabilities || {},
              weakCapabilities: capabilityAnalysis.weak_capabilities || {}
            });
            importedCount++;
            console.log(`Successfully imported capability analysis for: ${standardizedCategory}`);
          } catch (recordError: any) {
            const errorMessage = `Failed to import ${record?.standardized_category || 'unknown'}: ${recordError.message}`;
            console.error(errorMessage);
            errors.push(errorMessage);
          }
        }
      } catch (error: any) {
        console.error('Error during user capability analysis import:', error);
        throw error;
      }
    } else if (filePath.includes('intent_broader_categories.json')) {
      console.log('Processing intent broader categories data');

      try {
        // First clear existing broader categories
        await db.delete(intentBroaderCategories);
        console.log('Cleared existing broader categories data');

        for (const record of jsonData) {
          try {
            const standardizedCategory = record.standardized_category;
            const broaderCategories = record.broader_categories;

            if (!standardizedCategory || !broaderCategories) {
              console.error('Missing required fields in record:', record);
              throw new Error('Missing required fields');
            }

            console.log(`Importing broader category: ${standardizedCategory}`);

            await db.insert(intentBroaderCategories).values({
              standardizedCategory,
              broaderCategories
            });
            importedCount++;
            console.log(`Successfully imported broader category: ${standardizedCategory}`);
          } catch (recordError: any) {
            const errorMessage = `Failed to import ${record?.standardized_category || 'unknown'}: ${recordError.message}`;
            console.error(errorMessage);
            errors.push(errorMessage);
          }
        }
      } catch (error: any) {
        console.error('Error during broader categories import:', error);
        throw error;
      }
    } else if (filePath.includes('work_area_broader_categories.json')) {
      console.log('Processing work area broader categories data');

      try {
        // First clear existing work area broader categories
        await db.delete(workAreaBroaderCategories);
        console.log('Cleared existing work area broader categories data');

        for (const record of jsonData) {
          try {
            const standardizedCategory = record.standardized_category;
            const broaderWorkAreas = record.broader_work_areas;

            if (!standardizedCategory || !broaderWorkAreas) {
              console.error('Missing required fields in record:', record);
              throw new Error('Missing required fields');
            }

            console.log(`Importing work area broader category: ${standardizedCategory}`);

            await db.insert(workAreaBroaderCategories).values({
              standardizedCategory,
              broaderWorkAreas
            });
            importedCount++;
            console.log(`Successfully imported work area broader category: ${standardizedCategory}`);
          } catch (recordError: any) {
            const errorMessage = `Failed to import ${record?.standardized_category || 'unknown'}: ${recordError.message}`;
            console.error(errorMessage);
            errors.push(errorMessage);
          }
        }
      } catch (error: any) {
        console.error('Error during work area broader categories import:', error);
        throw error;
      }
    } else {
      // Handle regular code reviews import
      for (const record of jsonData) {
        try {
          const processedTimestamp = record.processed_timestamp ? 
            new Date(record.processed_timestamp) : 
            new Date();

          await db.insert(codeReviews).values({
            filename: record.filename || 'unknown',
            rawCategory: record.raw_category,
            standardizedCategory: record.standardized_category,
            rawIntent: record.raw_intent,
            standardizedIntent: record.standardized_intent,
            relatedWorkAreas: record.related_work_areas || [],
            provider: record.provider,
            processedTimestamp: processedTimestamp,
            capabilityAnalysis: record.capability_analysis || [],
            suggestedTraining: record.suggested_training || []
          });
          importedCount++;
        } catch (recordError: any) {
          const errorMessage = `Failed to import ${record?.filename || 'unknown'}: ${recordError.message}`;
          console.error(errorMessage);
          errors.push(errorMessage);
        }
      }
    }

    console.log(`Import completed. Successfully imported ${importedCount} records`);
    if (errors.length > 0) {
      console.log(`Encountered ${errors.length} errors during import`);
      console.log('Errors:', errors);
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