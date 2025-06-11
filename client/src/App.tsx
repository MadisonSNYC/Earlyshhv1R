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
    // Bundle analysis setup
    markModuleAsUsed('react');
    markModuleAsUsed('@tanstack/react-query');
    markModuleAsUsed('wouter');
    
    // Log bundle analysis after app loads
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
              <Route path="/" component={HomePage} />
              <Route path="/onboarding" component={OnboardingPage} />
              <Route path="/coupon/:id" component={CouponRedeemPage} />
              <Route path="/partnership/:id" component={PartnershipConfirmationPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/my-coupons" component={MyCouponsPage} />
              <Route path="/notifications" component={NotificationsPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/activity/:id" component={ActivityDetailPage} />
              <Route component={NotFoundPage} />
            </Suspense>
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;