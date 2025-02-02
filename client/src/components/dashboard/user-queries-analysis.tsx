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
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Knowledge Domain Analysis</h2>
        <p className="text-gray-600">Core technical knowledge areas and capability assessment across domains</p>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {capabilities.capabilities.map((capability: CategoryCapability, index: number) => (
          <Card key={index} className="p-6 border border-gray-100 shadow-sm hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-medium">{capability.category}</CardTitle>
            </CardHeader>
            <hr className="border-b border-gray-100 my-4" />
            <div className="h-[300px] transition duration-200 ease-in-out transform hover:scale-105">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={capability.metrics.capabilities}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="name"
                    tick={{
                      fontSize: 9,
                      fill: "hsl(var(--muted-foreground))",
                      width: 200,
                      dy: 10
                    }}
                  />
                  <Radar
                    name="Scores"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="rgba(96,165,250,0.6)"
                    fillOpacity={1}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-base text-gray-700">Knowledge Area:</p>
              <p className="text-sm text-gray-600">{capability.userQuery}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}