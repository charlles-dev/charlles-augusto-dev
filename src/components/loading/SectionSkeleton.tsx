import { Skeleton } from "@/components/ui/skeleton";

interface SectionSkeletonProps {
  type?: 'projects' | 'education' | 'experience' | 'hero';
}

export function SectionSkeleton({ type = 'projects' }: SectionSkeletonProps) {
  if (type === 'hero') {
    return (
      <div className="py-20 sm:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'projects') {
    return (
      <div className="py-20 sm:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-32 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-32 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}