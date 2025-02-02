import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getUserQueriesAnalysis, getCapabilitiesAnalysis } from "@/lib/data";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CapabilityMetric {
  name: string;
  score: number;
  type: 'strong' | 'weak';
}

interface CategoryCapability {
  category: string;
  userQuery: string;
  metrics: {
    capabilities: CapabilityMetric[];
    strongCapabilities: number;
    weakCapabilities: number;
    overallScore: number;
  };
}

export default function UserQueriesAnalysis() {
  const { data: capabilities } = useQuery({
    queryKey: ["/api/analysis/capabilities"],
    queryFn: getCapabilitiesAnalysis
  });

  if (!capabilities) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {capabilities.capabilities.map((capability: CategoryCapability, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{capability.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={capability.metrics.capabilities}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <Radar
                    name="Scores"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Overall Score</span>
                <Badge variant="outline">
                  {Math.round(capability.metrics.overallScore * 10) / 10}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Query: {capability.userQuery}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}