import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getUserQueriesAnalysis } from "@/lib/data";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function UserQueriesAnalysis() {
  const { data: queries } = useQuery({
    queryKey: ["/api/analysis/queries"],
    queryFn: getUserQueriesAnalysis
  });

  if (!queries) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Query Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={queries.distribution}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <Radar
                  name="Queries"
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  stroke="hsl(var(--primary))"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Query Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {queries.categories.map((category, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge>{category.count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              <ul className="space-y-4">
                {queries.insights.map((insight, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Badge variant="outline">{i + 1}</Badge>
                    <div>
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
