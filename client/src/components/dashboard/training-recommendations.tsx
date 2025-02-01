import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getTrainingRecommendations } from "@/lib/data";

export default function TrainingRecommendations() {
  const { data: training } = useQuery({
    queryKey: ["/api/analysis/training"],
    queryFn: getTrainingRecommendations
  });

  if (!training) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {training.recommendations.map((rec, i) => (
              <div
                key={i}
                className="mb-6 pb-6 border-b last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={rec.priority === "High" ? "destructive" : "default"}>
                      {rec.priority}
                    </Badge>
                    <h3 className="font-medium">{rec.course}</h3>
                  </div>
                  <Badge variant="outline">{rec.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {rec.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Impact Score</span>
                    <span>{rec.impactScore}%</span>
                  </div>
                  <Progress value={rec.impactScore} />
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {training.skillGaps.map((gap, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{gap.skill}</span>
                    <Badge variant="outline">{gap.level}</Badge>
                  </div>
                  <Progress value={gap.currentProficiency} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Required: {gap.requiredProficiency}%
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {training.learningPaths.map((path, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{path.name}</h3>
                    <Badge>{path.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, j) => (
                      <Badge key={j} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
