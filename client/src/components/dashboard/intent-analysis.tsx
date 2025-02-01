import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getIntentAnalysis } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
            {intents.distribution.map((intent, i) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{intent.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {intent.percentage}%
                  </span>
                </div>
                <Progress value={intent.percentage} />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Common Intent Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {intents.patterns.map((pattern, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{pattern.name}</span>
                    <Badge>{pattern.frequency}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pattern.description}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intent Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {intents.trends.map((trend, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{trend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trend.change > 0 ? "+" : ""}
                      {trend.change}% from last period
                    </p>
                  </div>
                  <Badge
                    variant={trend.change > 0 ? "default" : "secondary"}
                  >
                    {trend.currentCount}
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
