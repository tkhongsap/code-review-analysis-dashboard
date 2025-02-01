import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCategoryAnalysis } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

interface Category {
  name: string;
  value: number;
  trend: number;
  description: string;
}

export default function CategoryAnalysis() {
  const { data: categories } = useQuery({
    queryKey: ["/api/analysis/categories"],
    queryFn: getCategoryAnalysis
  });

  if (!categories) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {categories.distribution.map((category: Category, i: number) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{category.value}</div>
                <Badge 
                  variant={
                    category.trend > 0 
                      ? "default" 
                      : category.trend < 0 
                      ? "destructive" 
                      : "secondary"
                  }
                  className="flex items-center gap-1"
                >
                  {category.trend > 0 ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : category.trend < 0 ? (
                    <ArrowDownIcon className="w-3 h-3" />
                  ) : (
                    <MinusIcon className="w-3 h-3" />
                  )}
                  {Math.abs(category.trend)}%
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {categories.insights.map((insight: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <Badge variant="outline">{i + 1}</Badge>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}