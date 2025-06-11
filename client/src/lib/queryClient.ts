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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
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

// Prefetch commonly used queries
export function prefetchCommonQueries() {
  // Prefetch user data
  queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(res => res.json()),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Prefetch campaigns
  queryClient.prefetchQuery({
    queryKey: ['campaigns'],
    queryFn: () => fetch('/api/campaigns').then(res => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Background cache warming
export function warmCache() {
  // Warm frequently accessed data in the background
  const warmQueries = [
    ['notifications'],
    ['user', 'stats'],
    ['campaigns', 'categories'],
  ];

  warmQueries.forEach(queryKey => {
    if (!queryClient.getQueryData(queryKey)) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetch(`/api/${queryKey.join('/')}`).then(res => res.json()),
        staleTime: 1000 * 60 * 15, // 15 minutes
      });
    }
  });
}