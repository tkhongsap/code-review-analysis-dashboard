import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getIntentAnalysis } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Distribution {
  category: string;
  count: number;
  percentage: number;
}

interface Insight {
  intent: string;
  keywords: string[];
}

interface TopKeyword {
  keyword: string;
  count: number;
  percentage: number;
}

export default function IntentAnalysis() {
  const { data: intents } = useQuery({
    queryKey: ["/api/analysis/intents"],
    queryFn: getIntentAnalysis
  });

  if (!intents) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Intent Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {intents.distribution.map((item: Distribution, i: number) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
                <Progress value={item.percentage} />
                <p className="text-sm text-muted-foreground mt-1">
                  Count: {item.count}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Intent Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {intents.insights.map((insight: Insight, i: number) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <p className="font-medium mb-2">{insight.intent}</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.keywords.map((keyword, j) => (
                      <Badge key={j} variant="secondary">
                        {keyword}
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
            <CardTitle>Top Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {intents.topKeywords.map((item: TopKeyword, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.keyword}</p>
                    <p className="text-sm text-muted-foreground">
                      Used in {item.percentage}% of intents
                    </p>
                  </div>
                  <Badge>
                    {item.count}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}