import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Only retry once for mutations
        return failureCount < 1;
      },
    },
  },
});

// Cache configuration by data type
export const CACHE_KEYS = {
  campaigns: ['campaigns'],
  userCoupons: ['coupons', 'user'],
  notifications: ['notifications'],
  userProfile: ['user', 'profile'],
  analytics: ['analytics'],
} as const;

export const CACHE_TIMES = {
  // Short-lived data (frequently changing)
  notifications: 30 * 1000, // 30 seconds
  analytics: 2 * 60 * 1000, // 2 minutes

  // Medium-lived data
  campaigns: 5 * 60 * 1000, // 5 minutes
  userCoupons: 2 * 60 * 1000, // 2 minutes

  // Long-lived data (rarely changing)
  userProfile: 10 * 60 * 1000, // 10 minutes
  staticContent: 30 * 60 * 1000, // 30 minutes
} as const;

// Prefetch helpers
export function prefetchCampaigns(location?: { lat: number; lng: number }) {
  return queryClient.prefetchQuery({
    queryKey: [...CACHE_KEYS.campaigns, location],
    queryFn: () => fetch(`/api/campaigns?lat=${location?.lat}&lng=${location?.lng}`).then(res => res.json()),
    staleTime: CACHE_TIMES.campaigns,
  });
}

export function prefetchUserData(userId: string) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: [...CACHE_KEYS.userCoupons, userId],
      queryFn: () => fetch(`/api/users/${userId}/coupons`).then(res => res.json()),
      staleTime: CACHE_TIMES.userCoupons,
    }),
    queryClient.prefetchQuery({
      queryKey: [...CACHE_KEYS.notifications, userId],
      queryFn: () => fetch(`/api/notifications`).then(res => res.json()),
      staleTime: CACHE_TIMES.notifications,
    }),
  ]);
}

// Cache invalidation helpers
export function invalidateUserData(userId: string) {
  queryClient.invalidateQueries({ queryKey: [...CACHE_KEYS.userCoupons, userId] });
  queryClient.invalidateQueries({ queryKey: [...CACHE_KEYS.notifications, userId] });
}

export function invalidateCampaigns() {
  queryClient.invalidateQueries({ queryKey: CACHE_KEYS.campaigns });
}