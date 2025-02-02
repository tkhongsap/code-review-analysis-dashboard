import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { TrainingAnalysis } from "@/lib/data";

async function getTrainingRecommendations(): Promise<TrainingAnalysis> {
  const response = await fetch("/api/analysis/training");
  if (!response.ok) throw new Error("Failed to fetch training recommendations");
  return response.json();
}

export default function TrainingRecommendations() {
  const { data: training } = useQuery({
    queryKey: ["/api/analysis/training"],
    queryFn: getTrainingRecommendations,
  });

  if (!training) return null;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Training Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {training.recommendations.map((rec, i) => {
            // Parse recommendations to create data points for the spider chart
            const dataPoints = rec.training_plan.recommendations.map(rec => {
              const [name, score] = rec.split(" (Priority: ");
              return {
                name,
                value: Number(score.replace(")", ""))
              };
            });

            return (
              <div
                key={i}
                className="mb-8 pb-8 border-b last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge>{rec.standardized_category}</Badge>
                  <Badge variant="outline">{Math.round(rec.training_plan.timeEstimate)}h</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {rec.training_query}
                </p>

                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      data={dataPoints}
                      outerRadius={180}
                    >
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
                        fill="hsl(var(--primary))"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {rec.training_plan.recommendations.map((recommendation, j) => (
                      <li key={j} className="flex items-center">
                        <span className="mr-2">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}