import { existsSync, readFileSync } from 'fs';
import { db } from "@db";
import { intents } from "@db/schema";

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

    // Drop existing data if any
    await db.delete(intents);
    console.log('Cleared existing intents data');

    // Import new data
    for (const record of jsonData) {
      try {
        if (!record.standardized_category || !record.broader_categories) {
          throw new Error('Missing required fields');
        }

        await db.insert(intents).values({
          standardizedCategory: record.standardized_category,
          broaderCategories: record.broader_categories,
        });

        importedCount++;
        console.log(`Successfully imported category: ${record.standardized_category}`);
      } catch (recordError: any) {
        const errorMessage = `Failed to import ${record?.standardized_category || 'unknown'}: ${recordError.message}`;
        console.error(errorMessage);
        errors.push(errorMessage);
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