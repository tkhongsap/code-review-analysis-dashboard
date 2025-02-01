import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getWorkAreaAnalysis } from "@/lib/data";

interface WorkArea {
  name: string;
  count: number;
  percentage: number;
  broaderAreas: string[];
}

interface WorkAreaInsight {
  workArea: string;
  count: number;
  broaderAreas: string[];
  description: string;
}

interface Trend {
  title: string;
  description: string;
}

interface WorkAreaAnalysisData {
  distribution: WorkArea[];
  insights: WorkAreaInsight[];
  trends: Trend[];
}

export default function WorkAreaAnalysis() {
  const { data: workAreas } = useQuery<WorkAreaAnalysisData>({
    queryKey: ["/api/analysis/workareas"],
    queryFn: getWorkAreaAnalysis
  });

  if (!workAreas) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Work Area Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {workAreas.distribution.map((area) => (
              <div key={area.name} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{area.name}</span>
                  <Badge variant="outline">{area.count}</Badge>
                </div>
                <Progress value={area.percentage} className="mb-2" />
                <div className="flex flex-wrap gap-2">
                  {area.broaderAreas.map((category, i) => (
                    <Badge key={i} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Work Area Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {workAreas.insights.map((insight, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{insight.workArea}</span>
                    <Badge>{insight.count} reviews</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {insight.broaderAreas.map((area, j) => (
                      <Badge key={j} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emerging Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[180px]">
              {workAreas.trends.map((trend, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <h3 className="font-medium mb-1">{trend.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {trend.description}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}