import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

interface TrainingMetrics {
  name: string;
  value: number;
}

interface TrainingRecommendation {
  category: string;
  query: string;
  metrics: {
    implementation: number;
    theoretical: number;
    practical: number;
    complexity: number;
    impact: number;
  };
  recommendations: string[];
  timeEstimate: number;
}

interface TrainingData {
  recommendations: TrainingRecommendation[];
  summary: {
    totalRecommendations: number;
    averageTimeEstimate: number;
    categoryBreakdown: Record<string, number>;
  };
}

async function getTrainingRecommendations(): Promise<TrainingData> {
  const response = await fetch("/api/analysis/training");
  if (!response.ok) {
    throw new Error("Failed to fetch training recommendations");
  }
  return response.json();
}

export default function TrainingRecommendations() {
  const { data: training } = useQuery({
    queryKey: ["/api/analysis/training"],
    queryFn: getTrainingRecommendations,
  });

  if (!training) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Training Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {training.recommendations.map((rec, i) => (
              <div
                key={i}
                className="mb-6 pb-6 border-b last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge>{rec.category}</Badge>
                  <Badge variant="outline">{Math.round(rec.timeEstimate)}h</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {rec.query}
                </p>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { name: "Priority", value: rec.priority === "High" ? 100 : 50 },
                      { name: "Impact", value: rec.impactScore },
                      { name: "Category Focus", value: 75 }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <Radar
                        name="Metrics"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {rec.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground">
                      {rec.recommendations.map((recommendation, j) => (
                        <li key={j}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Total Recommendations</span>
                  <span className="font-medium">
                    {training.summary.totalRecommendations}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (training.summary.totalRecommendations / 10) * 100)} 
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Average Time Estimate</span>
                  <span className="font-medium">
                    {Math.round(training.summary.averageTimeEstimate)}h
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (training.summary.averageTimeEstimate / 40) * 100)} 
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Category Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(training.summary.categoryBreakdown).map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (count / training.summary.totalRecommendations) * 100)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}