import React, { Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';

import { queryClient } from './lib/queryClient';
import { AuthProvider } from './lib/auth';
import { ErrorBoundary } from './components/error-boundary';
import GlobalErrorHandler from './components/global-error-handler';
import LoadingScreen from './components/loading-screen';
import { BundleAnalyzer, markModuleAsUsed } from './lib/bundle-analyzer';

// Lazy load pages with better chunk names
const HomePage = React.lazy(() => import(/* webpackChunkName: "home" */ './pages/home'));
const OnboardingPage = React.lazy(() => import(/* webpackChunkName: "onboarding" */ './pages/onboarding'));
const CouponRedeemPage = React.lazy(() => import(/* webpackChunkName: "coupon" */ './pages/coupon-redeem'));
const PartnershipConfirmationPage = React.lazy(() => import(/* webpackChunkName: "partnership" */ './pages/partnership-confirmation'));
const ProfilePage = React.lazy(() => import(/* webpackChunkName: "profile" */ './pages/profile'));
const MyCouponsPage = React.lazy(() => import(/* webpackChunkName: "my-coupons" */ './pages/my-coupons'));
const NotificationsPage = React.lazy(() => import(/* webpackChunkName: "notifications" */ './pages/notifications'));
const AnalyticsPage = React.lazy(() => import(/* webpackChunkName: "analytics" */ './pages/analytics'));
const SettingsPage = React.lazy(() => import(/* webpackChunkName: "settings" */ './pages/settings'));
const ActivityDetailPage = React.lazy(() => import(/* webpackChunkName: "activity" */ './pages/activity-detail'));
const NotFoundPage = React.lazy(() => import(/* webpackChunkName: "not-found" */ './pages/not-found'));

function App() {
  useEffect(() => {
    // Mark core modules as used
    markModuleAsUsed('react');
    markModuleAsUsed('react-dom');
    markModuleAsUsed('wouter');
    markModuleAsUsed('@tanstack/react-query');

    // Report bundle info after app loads
    setTimeout(() => {
      const report = BundleAnalyzer.getBundleReport();
      console.log('Bundle Report:', report);
    }, 2000);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GlobalErrorHandler />
          <div className="min-h-screen electric-bg">
            <Suspense fallback={<LoadingScreen />}>
              <Route path="/">
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              </Route>
              <Route path="/onboarding">
                <ErrorBoundary>
                  <OnboardingPage />
                </ErrorBoundary>
              </Route>
              <Route path="/coupon/:id">
                <ErrorBoundary>
                  <CouponRedeemPage />
                </ErrorBoundary>
              </Route>
              <Route path="/partnership/:id">
                <ErrorBoundary>
                  <PartnershipConfirmationPage />
                </ErrorBoundary>
              </Route>
              <Route path="/profile">
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              </Route>
              <Route path="/my-coupons">
                <ErrorBoundary>
                  <MyCouponsPage />
                </ErrorBoundary>
              </Route>
              <Route path="/notifications">
                <ErrorBoundary>
                  <NotificationsPage />
                </ErrorBoundary>
              </Route>
              <Route path="/analytics">
                <ErrorBoundary>
                  <AnalyticsPage />
                </ErrorBoundary>
              </Route>
              <Route path="/settings">
                <ErrorBoundary>
                  <SettingsPage />
                </ErrorBoundary>
              </Route>
              <Route path="/activity/:id">
                <ErrorBoundary>
                  <ActivityDetailPage />
                </ErrorBoundary>
              </Route>
              <Route>
                <ErrorBoundary>
                  <NotFoundPage />
                </ErrorBoundary>
              </Route>
            </Suspense>
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;