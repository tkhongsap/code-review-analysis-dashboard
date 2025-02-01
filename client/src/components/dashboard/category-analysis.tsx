import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCategoryAnalysis } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

export default function CategoryAnalysis() {
  const { data: categories } = useQuery({
    queryKey: ["/api/analysis/categories"],
    queryFn: getCategoryAnalysis
  });

  if (!categories) return null;

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {categories.distribution.map((category, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
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
                  {category.description || `Total ${category.name.toLowerCase()} reviews`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <ul className="space-y-2">
                {categories.insights.map((insight, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Badge variant="outline">{i + 1}</Badge>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {categories.topCategories.map((category, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge>{category.count}</Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}