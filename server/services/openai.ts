import OpenAI from "openai";
import { db } from "@db";
import { codeReviews, categories, intents, workAreas, trainingRecommendations } from "@db/schema";
import { desc } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

export async function analyzeCodeReviews() {
  try {
    // Get all code reviews from database
    const reviews = await db.query.codeReviews.findMany();

    // Generate analysis using GPT-4
    const prompt = `Analyze the following code review data and provide insights in JSON format:
    ${JSON.stringify(reviews)}

    Please provide:
    1. Category distribution and trends
    2. Intent patterns and frequencies
    3. Work area analysis with skill gaps
    4. Training recommendations based on identified patterns

    Format the response as JSON with these keys:
    {
      "categoryAnalysis": [...],
      "intentAnalysis": [...],
      "workAreaAnalysis": [...],
      "trainingRecommendations": [...]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a code review analysis expert." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const analysis = JSON.parse(content);

    // Store the analysis results in respective tables
    await db.insert(categories).values(analysis.categoryAnalysis);
    await db.insert(intents).values(analysis.intentAnalysis);
    await db.insert(workAreas).values(analysis.workAreaAnalysis);
    await db.insert(trainingRecommendations).values(analysis.trainingRecommendations);

    return analysis;
  } catch (error) {
    console.error("Error analyzing code reviews:", error);
    throw error;
  }
}

export async function generateTrainingRecommendations() {
  try {
    // Get recent code reviews
    const reviews = await db.query.codeReviews.findMany({
      orderBy: [{ processedTimestamp: desc }],
      limit: 10
    });

    const prompt = `Based on these recent code reviews:
    ${JSON.stringify(reviews)}

    Generate personalized training recommendations. Consider:
    1. Current skill gaps
    2. Areas needing improvement
    3. Priority of different training areas

    Format as JSON with:
    {
      "recommendations": [
        {
          "course": string,
          "priority": "High" | "Medium" | "Low",
          "category": string,
          "description": string,
          "impactScore": number
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a technical training advisor." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
}