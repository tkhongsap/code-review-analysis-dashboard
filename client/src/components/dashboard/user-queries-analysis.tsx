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

interface Category {
  name: string;
  count: number;
  description: string;
}

interface Insight {
  title: string;
  description: string;
}

interface CapabilityMetric {
  name: string;
  score: number;
  type: 'strong' | 'weak';
}

interface CategoryCapability {
  category: string;
  metrics: {
    strongCapabilities: number;
    weakCapabilities: number;
    overallScore: number;
    capabilities: CapabilityMetric[];
  };
}

export default function UserQueriesAnalysis() {
  const { data: queries } = useQuery({
    queryKey: ["/api/analysis/queries"],
    queryFn: getUserQueriesAnalysis
  });

  const { data: capabilities } = useQuery({
    queryKey: ["/api/analysis/capabilities"],
    queryFn: getCapabilitiesAnalysis
  });

  if (!queries || !capabilities) return null;

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
                    name="Strong Capabilities"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.5}
                    data={capability.metrics.capabilities.filter(cap => cap.type === 'strong')}
                  />
                  <Radar
                    name="Weak Capabilities"
                    dataKey="score"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.3}
                    data={capability.metrics.capabilities.filter(cap => cap.type === 'weak')}
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
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Categories</p>
              <p className="text-2xl font-bold">{capabilities.summary.totalCategories}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Strong Score</p>
              <p className="text-2xl font-bold">
                {Math.round(capabilities.summary.averageStrong * 10) / 10}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Weak Score</p>
              <p className="text-2xl font-bold">
                {Math.round(capabilities.summary.averageWeak * 10) / 10}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}