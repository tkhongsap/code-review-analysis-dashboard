import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCategoryAnalysis } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ChartPieIcon } from "lucide-react";
import TopSupportTrends from "@/components/TopSupportTrends";
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
}

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
  const sortedCategories = [...categories.distribution].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Transform insights into the shape expected by TopSupportTrends
  const trendsData = categories.insights.map((insight) => ({
    icon: <ChartPieIcon />,       // You can replace this with any relevant icon
    iconColor: "#3b82f6",         // Default icon color
    category: insight.category,
    description: insight.description,
    focusAreas: ["Placeholder 1", "Placeholder 2"], // Example tags
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
                  <ChartPieIcon className="w-3 h-3" />
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