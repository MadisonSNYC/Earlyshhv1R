
import { Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen electric-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}

export function CampaignCardSkeleton() {
  return (
    <Card className="glass-morphism p-4 border-0">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function CampaignListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CouponSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>

      <Card className="glass-morphism p-6 border-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass-morphism p-8 border-0 text-center">
        <div className="space-y-4">
          <Skeleton className="w-48 h-48 mx-auto rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 mx-auto" />
            <Skeleton className="h-6 w-40 mx-auto" />
          </div>
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </Card>
    </div>
  );
}

export function InlineLoading({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <Loader2 className={`animate-spin text-cyan-400 ${sizeClasses[size]}`} />
  );
}
