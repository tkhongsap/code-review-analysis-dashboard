import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "@/lib/data";
import { BarChart3, FileCode, Users } from "lucide-react";

export default function OverviewMetrics() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
    queryFn: getMetrics
  });

  if (!metrics) return null;

  return (
    <div className="grid gap-4 grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <FileCode className="h-8 w-8 text-primary" />
            <div>
              <p className="text-base font-bold text-foreground">Total Reviews</p>
              <h3 className="text-2xl font-bold">{metrics.totalReviews}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-base font-bold text-foreground">Categories</p>
              <h3 className="text-2xl font-bold">{metrics.uniqueCategories}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-base font-bold text-foreground">Work Areas</p>
              <h3 className="text-2xl font-bold">{metrics.uniqueWorkAreas}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}