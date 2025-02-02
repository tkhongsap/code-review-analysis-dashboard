import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getWorkAreaAnalysis, getCategoryAnalysis } from "@/lib/data";
import {
  CodeIcon,
  TerminalIcon,
  BarChartIcon,
  DatabaseIcon,
  RocketIcon,
  BugIcon,
  ChartPieIcon,
  ShieldIcon,
  HelpCircleIcon,
  TestTubesIcon,
} from "lucide-react";

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

// Map domains to relevant icons
const domainIcons: Record<string, JSX.Element> = {
  'API Integration': <CodeIcon className="h-5 w-5" />,
  'Code Development': <TerminalIcon className="h-5 w-5" />,
  'Data Processing': <BarChartIcon className="h-5 w-5" />,
  'Database Management': <DatabaseIcon className="h-5 w-5" />,
  'DevOps & Automation': <RocketIcon className="h-5 w-5" />,
  'Error Handling': <BugIcon className="h-5 w-5" />,
  'Performance Optimization': <ChartPieIcon className="h-5 w-5" />,
  'Security & Authentication': <ShieldIcon className="h-5 w-5" />,
  'Technical Support': <HelpCircleIcon className="h-5 w-5" />,
  'Testing & QA': <TestTubesIcon className="h-5 w-5" />,
};

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

  // Sort insights alphabetically by workArea
  const sortedInsights = [...workAreas.insights].sort((a, b) => 
    a.workArea.localeCompare(b.workArea)
  );

  // Create a map of category counts for percentage calculation
  const categoryCountMap = new Map(
    categories.distribution.map(cat => [cat.name, cat.value])
  );

  const totalCategoryCount = categories.distribution.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Technical Domain Coverage</h1>
        <p className="text-muted-foreground">
          Distribution of support requests by technical domains and their related areas of expertise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedInsights.map((insight, i) => {
          const categoryCount = categoryCountMap.get(insight.workArea) || 0;
          const percentage = Math.round((categoryCount / totalCategoryCount) * 100);

          return (
            <Card 
              key={i}
              className="group transition-shadow duration-200 hover:shadow-md border-gray-100"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {domainIcons[insight.workArea] || <ChartPieIcon className="h-5 w-5" />}
                    <CardTitle className="text-base font-medium">
                      {insight.workArea}
                    </CardTitle>
                  </div>
                  <Badge 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    {percentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-t border-gray-100 my-4" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Related Domains:</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.broaderAreas.map((area, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-200"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}