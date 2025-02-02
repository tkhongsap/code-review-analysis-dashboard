import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from "recharts";
import { TrainingAnalysis } from "@/lib/data";

async function getTrainingRecommendations(): Promise<TrainingAnalysis> {
  const response = await fetch("/api/analysis/training");
  if (!response.ok) throw new Error("Failed to fetch training gap analysis");
  return response.json();
}

export default function TrainingRecommendations() {
  const { data: training } = useQuery({
    queryKey: ["/api/analysis/training"],
    queryFn: getTrainingRecommendations
  });

  if (!training) return null;

  const getPriorityBadgeClasses = (priority: number) => {
    if (priority === 10)
      return "rounded-full bg-red-100 text-red-700 px-2 py-0.5";
    if (priority === 9)
      return "rounded-full bg-orange-100 text-orange-700 px-2 py-0.5";
    return "rounded-full bg-gray-100 text-gray-700 px-2 py-0.5";
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Training Gap Analysis</h2>
        <p className="text-gray-600">
          Assessment of training needs and recommendations across technical domains
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {training.recommendations.map((rec, i) => {
          const parsedRecommendations = rec.training_plan.recommendations.map(
            (recItem) => {
              const [name, priorityStr] = recItem.split(" (Priority: ");
              const priority = Number(priorityStr.replace(")", ""));
              return { name, priority };
            }
          );
          const dataPoints = parsedRecommendations.map((item) => ({
            name: item.name,
            value: item.priority
          }));
          return (
            <Card key={i} className="p-6 border border-gray-100 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xl font-medium">
                  {rec.standardized_category}
                </div>
                <div className="rounded-full bg-blue-100 text-blue-700 px-3 py-1">
                  {Math.round(rec.training_plan.timeEstimate)}h
                </div>
              </div>
              <hr className="border-b border-gray-100 my-4" />
              <p className="text-base text-gray-700 mb-4">{rec.training_query}</p>
              <div className="h-[400px] w-full transition duration-200 ease-in-out transform hover:scale-105">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dataPoints} outerRadius={180}>
                    <PolarGrid />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                        width: 200,
                        dy: 15
                      }}
                    />
                    <Radar
                      name="Priority"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="rgba(96,165,250,0.6)"
                      fillOpacity={1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  {parsedRecommendations.map((recommendation, j) => (
                    <li
                      key={j}
                      className="flex items-center justify-between hover:bg-gray-50 p-2 rounded"
                    >
                      <span>{recommendation.name}</span>
                      <span
                        className={getPriorityBadgeClasses(recommendation.priority)}
                      >
                        {recommendation.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}