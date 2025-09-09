import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ExperienceSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent h-full" />
      
      <div className="space-y-8">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="relative flex items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full border-4 border-primary bg-background flex items-center justify-center z-10">
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
            
            <div className="ml-8 flex-1">
              <Card className="bg-gradient-card border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-32 mt-2" />
                  <Skeleton className="h-4 w-28 mt-2" />
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};