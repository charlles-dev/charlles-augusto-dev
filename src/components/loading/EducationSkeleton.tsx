import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const EducationSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full overflow-hidden border-border/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
            <Skeleton className="w-full h-full" />
          </div>
          
          <CardHeader className="pt-6">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <div className="flex items-center gap-4 mt-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};