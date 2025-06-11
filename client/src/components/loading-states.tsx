
import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const PageLoading = memo(({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="min-h-screen electric-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
});

export const CampaignCardSkeleton = memo(() => {
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
});

export const CampaignListSkeleton = memo(({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const CouponDetailSkeleton = memo(() => {
  return (
    <div className="min-h-screen electric-bg p-4 flex items-center justify-center">
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
});

export const InlineLoading = memo(({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <Loader2 className={`animate-spin text-cyan-400 ${sizeClasses[size]}`} />
  );
});

// Virtualized list skeleton for large datasets
export const VirtualizedListSkeleton = memo(({ 
  itemHeight = 120, 
  visibleItems = 5 
}: { 
  itemHeight?: number; 
  visibleItems?: number; 
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: visibleItems }).map((_, i) => (
        <div key={i} style={{ height: itemHeight }}>
          <CampaignCardSkeleton />
        </div>
      ))}
    </div>
  );
});

PageLoading.displayName = 'PageLoading';
CampaignCardSkeleton.displayName = 'CampaignCardSkeleton';
CampaignListSkeleton.displayName = 'CampaignListSkeleton';
CouponDetailSkeleton.displayName = 'CouponDetailSkeleton';
InlineLoading.displayName = 'InlineLoading';
VirtualizedListSkeleton.displayName = 'VirtualizedListSkeleton';
