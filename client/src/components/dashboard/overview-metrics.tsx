import { Card, CardContent } from "@/components/ui/card";
import { Users2, Files, FolderKanban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "@/lib/data";

export default function OverviewMetrics() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
    queryFn: getMetrics,
  });

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Files className="h-8 w-8 text-primary" />
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
            <FolderKanban className="h-8 w-8 text-primary" />
            <div>
              <p className="text-base font-bold text-foreground">Categories</p>
              <h3 className="text-2xl font-bold">{metrics.uniqueCategories}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}