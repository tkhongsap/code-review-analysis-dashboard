import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getWorkAreaAnalysis } from "@/lib/data";

export default function WorkAreaAnalysis() {
  const { data: workAreas } = useQuery({
    queryKey: ["/api/analysis/workareas"],
    queryFn: getWorkAreaAnalysis
  });

  if (!workAreas) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Work Area Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {workAreas.distribution.map((area, i) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{area.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {area.percentage}%
                  </span>
                </div>
                <Progress value={area.percentage} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {area.relatedCategories.map((category, j) => (
                    <Badge key={j} variant="outline">
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
            <CardTitle>Skills Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {workAreas.skillsAnalysis.map((skill, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <Badge>{skill.level}</Badge>
                  </div>
                  <Progress value={skill.proficiency} />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-functional Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              {workAreas.crossFunctional.map((area, i) => (
                <div
                  key={i}
                  className="py-2 border-b last:border-0"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{area.name}</span>
                    <Badge variant="outline">{area.connections}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connected to: {area.connectedAreas.join(", ")}
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
