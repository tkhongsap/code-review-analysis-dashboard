import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCategoryAnalysis } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  ChartPieIcon,
  CodeIcon,
  DatabaseIcon,
  BugIcon,
  TerminalIcon,
  RocketIcon,
  BarChartIcon,
  ShieldIcon,
  HelpCircleIcon,
  TestTubesIcon,
} from "lucide-react";
import { TopSupportTrends } from "./TopSupportTrends";
import { useEffect } from "react";

interface Category {
  name: string;
  value: number;
  percentage: number;
  description: string;
}

interface CategoryInsight {
  category: string;
  description: string;
  focusAreas?: string[];
}

// Map categories to relevant icons
const categoryIcons = {
  'API Integration': <CodeIcon />,
  'Code Development': <TerminalIcon />,
  'Data Processing': <BarChartIcon />,
  'Database Management': <DatabaseIcon />,
  'DevOps & Automation': <RocketIcon />,
  'Error Handling': <BugIcon />,
  'Performance Optimization': <ChartPieIcon />,
  'Security & Authentication': <ShieldIcon />,
  'Technical Support': <HelpCircleIcon />,
  'Testing & QA': <TestTubesIcon />,
};

export default function CategoryAnalysis() {
  const { data: categories } = useQuery({
    queryKey: ["/api/analysis/categories"],
    queryFn: getCategoryAnalysis
  });

  useEffect(() => {
    console.log("CategoryAnalysis data:", categories);
  }, [categories]);

  if (!categories) return null;

  // Sort categories alphabetically by name
  const sortedCategories = [...categories.distribution].sort((a: Category, b: Category) => 
    a.name.localeCompare(b.name)
  );

  // Transform insights into the shape expected by TopSupportTrends
  const trendsData = categories.insights.map((insight: CategoryInsight) => ({
    icon: categoryIcons[insight.category as keyof typeof categoryIcons] || <ChartPieIcon />,
    iconColor: "#3b82f6",
    category: insight.category,
    description: insight.description,
    focusAreas: insight.focusAreas || extractFocusAreas(insight.description),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {sortedCategories.map((category: Category, i: number) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{category.value}</div>
                <Badge className="flex items-center gap-1">
                  {categoryIcons[category.name as keyof typeof categoryIcons] || <ChartPieIcon className="w-3 h-3" />}
                  {category.percentage}%
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <TopSupportTrends trendsData={trendsData} />
    </div>
  );
}

// Helper function to extract focus areas from description
function extractFocusAreas(description: string): string[] {
  // Split description by commas, periods, or "and", then clean up and filter
  return description
    .split(/[,.]\s+|\sand\s/g)
    .map(area => area.trim())
    .filter(area => area.length > 0 && area.length < 30) // Filter out too long or empty strings
    .slice(0, 3); // Take only first 3 areas
}