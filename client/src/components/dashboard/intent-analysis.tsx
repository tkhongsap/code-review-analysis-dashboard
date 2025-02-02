import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getIntentAnalysis, getCategoryAnalysis } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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

interface Insight {
  intent: string;
  keywords: string[];
  broaderCategories?: string[];
  description?: string;
}

interface Category {
  name: string;
  value: number;
  percentage: number;
}

// Map categories to relevant icons
const categoryIcons: Record<string, JSX.Element> = {
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

export default function IntentAnalysis() {
  const { data: intents } = useQuery({
    queryKey: ["/api/analysis/intents"],
    queryFn: getIntentAnalysis
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/analysis/categories"],
    queryFn: getCategoryAnalysis
  });

  if (!intents || !categories) return null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Support Requests</h1>
        <p className="text-muted-foreground">
          Current distribution of support requests across technical categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {intents.insights?.map((insight: Insight, i: number) => (
          <Card 
            key={i}
            className="group transition-shadow duration-200 hover:shadow-md border-gray-100"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {categoryIcons[insight.intent] || <ChartPieIcon className="h-5 w-5" />}
                  <CardTitle className="text-base font-medium">
                    {insight.intent}
                  </CardTitle>
                </div>
                <Badge 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {categories.distribution.find((d: Category) => d.name === insight.intent)?.percentage || 0}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-t border-border my-4" />
              <div className="flex flex-wrap gap-2">
                {Array.isArray(insight.keywords) && insight.keywords.map((keyword, j) => (
                  <span
                    key={j}
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              {insight.description && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {insight.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}