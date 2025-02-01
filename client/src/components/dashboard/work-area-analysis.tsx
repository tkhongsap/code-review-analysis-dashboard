import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getWorkAreaAnalysis, getCategoryAnalysis } from "@/lib/data";

interface WorkArea {
  name: string;
  count: number;
  percentage: number;
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

  const { data: categories } = useQuery({
    queryKey: ["/api/analysis/categories"],
    queryFn: getCategoryAnalysis
  });

  if (!workAreas || !categories) return null;

  const categoryCountMap = new Map(
    categories.distribution.map(cat => [cat.name, cat.value])
  );

  const totalCount = categories.distribution.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="grid gap-4 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Work Area Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              {workAreas.insights.map((insight, i) => (
                <div key={i} className="pb-6 border-b last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">{insight.workArea}</h3>
                    <Badge variant="secondary">
                      {Math.round(((categoryCountMap.get(insight.workArea) || 0) / totalCount) * 100)}%
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Broader Work Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {insight.broaderAreas.map((area, j) => (
                        <Badge key={j} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
  );
}