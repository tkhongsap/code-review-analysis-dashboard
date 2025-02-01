import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, FileCode, Users, BookOpen } from "lucide-react";
import { getMetrics } from "@/lib/data";

export default function OverviewMetrics() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
    queryFn: getMetrics
  });

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <FileCode className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
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
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
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
              <p className="text-sm font-medium text-muted-foreground">Work Areas</p>
              <h3 className="text-2xl font-bold">{metrics.uniqueWorkAreas}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Training Courses</p>
              <h3 className="text-2xl font-bold">{metrics.totalTrainingCourses}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
