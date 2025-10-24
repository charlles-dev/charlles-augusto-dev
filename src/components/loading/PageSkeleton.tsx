import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header skeleton */}
        <div className="mb-12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        {/* Content skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-4xl">
        <Skeleton className="h-16 w-32 mx-auto mb-6" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-20 w-5/6 mx-auto mb-8" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </section>
  );
};
