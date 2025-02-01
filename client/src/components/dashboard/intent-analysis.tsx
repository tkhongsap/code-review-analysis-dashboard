import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getIntentAnalysis } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Insight {
  intent: string;
  keywords: string[];
}

export default function IntentAnalysis() {
  const { data: intents } = useQuery({
    queryKey: ["/api/analysis/intents"],
    queryFn: getIntentAnalysis
  });

  if (!intents) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intent Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {intents.insights?.map((insight: Insight, i: number) => (
            <div
              key={i}
              className="mb-4 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{insight.intent}</p>
                <span className="text-sm text-muted-foreground">
                  {intents.distribution.find(d => d.category === insight.intent)?.percentage || 0}%
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(insight.keywords) && insight.keywords.map((keyword, j) => (
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
  );
}