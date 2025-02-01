import { useQuery } from "@tanstack/react-query";

export async function getMetrics() {
  const response = await fetch('/api/metrics');
  return response.json();
}

export async function getCategoryAnalysis() {
  const response = await fetch('/api/analysis/categories');
  return response.json();
}

export async function getWorkAreaAnalysis() {
  const response = await fetch('/api/analysis/workareas');
  return response.json();
}

export async function getUserQueriesAnalysis() {
  const response = await fetch('/api/analysis/queries');
  return response.json();
}

export async function getTrainingRecommendations() {
  const response = await fetch('/api/analysis/training');
  return response.json();
}