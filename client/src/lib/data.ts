import { useQuery } from "@tanstack/react-query";

export async function getMetrics() {
  const response = await fetch('/api/metrics');
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
}

export async function getCategoryAnalysis() {
  const response = await fetch('/api/analysis/categories');
  if (!response.ok) throw new Error('Failed to fetch category analysis');
  return response.json();
}

export async function getWorkAreaAnalysis() {
  const response = await fetch('/api/analysis/workareas');
  if (!response.ok) throw new Error('Failed to fetch work area analysis');
  return response.json();
}

export async function getIntentAnalysis() {
  const response = await fetch('/api/analysis/intents');
  if (!response.ok) throw new Error('Failed to fetch intent analysis');
  return response.json();
}

export async function getUserQueriesAnalysis() {
  const response = await fetch('/api/analysis/queries');
  if (!response.ok) throw new Error('Failed to fetch user queries analysis');
  return response.json();
}

export interface TrainingPlanMetrics {
  implementation: number;
  theoretical: number;
  practical: number;
  complexity: number;
  impact: number;
}

export interface TrainingPlan {
  metrics: TrainingPlanMetrics;
  recommendations: string[];
  timeEstimate: number;
}

export interface TrainingRecommendation {
  standardized_category: string;
  training_query: string;
  training_plan: TrainingPlan;
}

export interface TrainingAnalysis {
  recommendations: TrainingRecommendation[];
  summary: {
    totalRecommendations: number;
    averageTimeEstimate: number;
    categoryBreakdown: Record<string, number>;
  };
}

export async function getTrainingRecommendations(): Promise<TrainingAnalysis> {
  const response = await fetch('/api/analysis/training');
  if (!response.ok) throw new Error('Failed to fetch training recommendations');
  return response.json();
}

export async function getCapabilitiesAnalysis() {
  const response = await fetch('/api/analysis/capabilities');
  if (!response.ok) throw new Error('Failed to fetch capabilities analysis');
  return response.json();
}