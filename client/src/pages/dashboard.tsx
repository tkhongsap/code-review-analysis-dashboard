import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryAnalysis from "@/components/dashboard/category-analysis";
import IntentAnalysis from "@/components/dashboard/intent-analysis";
import WorkAreaAnalysis from "@/components/dashboard/work-area-analysis";
import UserQueriesAnalysis from "@/components/dashboard/user-queries-analysis";
import TrainingRecommendations from "@/components/dashboard/training-recommendations";
import OverviewMetrics from "@/components/dashboard/overview-metrics";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Code Review Insights
          </h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <OverviewMetrics />

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="category" className="w-full">
              <TabsList className="tabs-list grid w-full grid-cols-5">
                <TabsTrigger className="tab-trigger" value="category">
                  Category Analysis
                </TabsTrigger>
                <TabsTrigger className="tab-trigger" value="intent">
                  Support Request Analysis
                </TabsTrigger>
                <TabsTrigger className="tab-trigger" value="workarea">
                  Technical Domain Coverage
                </TabsTrigger>
                <TabsTrigger className="tab-trigger" value="queries">
                  Domain Analysis
                </TabsTrigger>
                <TabsTrigger className="tab-trigger" value="training">
                  Training Recommendation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="category">
                <CategoryAnalysis />
              </TabsContent>
              <TabsContent value="intent">
                <IntentAnalysis />
              </TabsContent>
              <TabsContent value="workarea">
                <WorkAreaAnalysis />
              </TabsContent>
              <TabsContent value="queries">
                <UserQueriesAnalysis />
              </TabsContent>
              <TabsContent value="training">
                <TrainingRecommendations />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
