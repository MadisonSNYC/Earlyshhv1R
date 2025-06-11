import React, { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Toaster } from 'sonner';

import { queryClient } from './lib/queryClient';
import { AuthProvider } from './lib/auth';
import { ErrorBoundary } from './components/error-boundary';
import { GlobalErrorHandler } from './components/global-error-handler';
import { LoadingScreen } from './components/loading-screen';

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
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GlobalErrorHandler />
          <div className="min-h-screen electric-bg">
            <Router>
              <Suspense fallback={<LoadingScreen />}>
                <Switch>
                  <Route path="/" component={() => (
                    <ErrorBoundary>
                      <HomePage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/onboarding" component={() => (
                    <ErrorBoundary>
                      <OnboardingPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/coupon/:id" component={() => (
                    <ErrorBoundary>
                      <CouponRedeemPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/partnership/:id" component={() => (
                    <ErrorBoundary>
                      <PartnershipConfirmationPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/profile" component={() => (
                    <ErrorBoundary>
                      <ProfilePage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/my-coupons" component={() => (
                    <ErrorBoundary>
                      <MyCouponsPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/notifications" component={() => (
                    <ErrorBoundary>
                      <NotificationsPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/analytics" component={() => (
                    <ErrorBoundary>
                      <AnalyticsPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/settings" component={() => (
                    <ErrorBoundary>
                      <SettingsPage />
                    </ErrorBoundary>
                  )} />
                  <Route path="/activity/:id" component={() => (
                    <ErrorBoundary>
                      <ActivityDetailPage />
                    </ErrorBoundary>
                  )} />
                  <Route component={() => (
                    <ErrorBoundary>
                      <NotFoundPage />
                    </ErrorBoundary>
                  )} />
                </Switch>
              </Suspense>
            </Router>
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;