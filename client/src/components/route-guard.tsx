import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  isPublicRoute?: boolean;
}

export function RouteGuard({ children, requireAuth = true, isPublicRoute = false }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated and route requires auth
      if (!user && requireAuth && !isPublicRoute) {
        setLocation('/onboarding');
      }
      
      // If user is authenticated and trying to access public route (like onboarding)
      if (user && isPublicRoute) {
        setLocation('/');
      }
    }
  }, [user, isLoading, requireAuth, isPublicRoute, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires auth and user is not authenticated
  if (!isLoading && !user && requireAuth && !isPublicRoute) {
    return null; // Will redirect in useEffect
  }

  // If user is authenticated and trying to access public route
  if (!isLoading && user && isPublicRoute) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
} 