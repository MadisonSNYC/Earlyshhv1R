import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { ToastProvider } from '@/components/ui/toast-provider';

import { AuthProvider } from './lib/auth';
import { ErrorBoundary } from './components/error-boundary';
import GlobalErrorHandler from './components/global-error-handler';
import { BundleAnalyzer, markModuleAsUsed } from './lib/bundle-analyzer';
import { RouteGuard } from './components/route-guard';
import LoadingScreen from './components/loading-screen';

// Lazy load pages with better chunk names
const HomePage = React.lazy(() => import(/* webpackChunkName: "home" */ './pages/home'));
const OnboardingPage = React.lazy(() => import(/* webpackChunkName: "onboarding" */ './pages/onboarding'));
const PartnershipConfirmationPage = React.lazy(() => import(/* webpackChunkName: "partnership" */ './pages/partnership-confirmation'));
const ProfilePage = React.lazy(() => import(/* webpackChunkName: "profile" */ './pages/profile'));
const MyCouponsPage = React.lazy(() => import(/* webpackChunkName: "my-coupons" */ './pages/my-coupons'));
const NotificationsPage = React.lazy(() => import(/* webpackChunkName: "notifications" */ './pages/notifications'));
const AnalyticsPage = React.lazy(() => import(/* webpackChunkName: "analytics" */ './pages/analytics'));
const SettingsPage = React.lazy(() => import(/* webpackChunkName: "settings" */ './pages/settings'));
const ActivityDetailPage = React.lazy(() => import(/* webpackChunkName: "activity" */ './pages/activity-detail'));
const QRCodePage = React.lazy(() => import(/* webpackChunkName: "qr-code" */ './pages/qr-code'));
const NotFoundPage = React.lazy(() => import(/* webpackChunkName: "not-found" */ './pages/not-found'));

function App() {
  useEffect(() => {
    // Bundle analysis setup
    markModuleAsUsed('react');
    markModuleAsUsed('wouter');
    
    // Log bundle analysis after app loads
    setTimeout(() => {
      const report = BundleAnalyzer.getBundleReport();
      console.log('Bundle Report:', report);
    }, 2000);
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <GlobalErrorHandler />
          <div className="min-h-screen earlyshh-bg">
            <Suspense fallback={<LoadingScreen message="Loading your experience..." />}>
              <Switch>
                {/* Public routes */}
                <Route path="/onboarding">
                  <RouteGuard isPublicRoute>
                    <OnboardingPage />
                  </RouteGuard>
                </Route>

                {/* Protected routes */}
                <Route path="/">
                  <RouteGuard>
                    <HomePage />
                  </RouteGuard>
                </Route>
                <Route path="/partnership/:id">
                  <RouteGuard>
                    <PartnershipConfirmationPage />
                  </RouteGuard>
                </Route>
                <Route path="/profile">
                  <RouteGuard>
                    <ProfilePage />
                  </RouteGuard>
                </Route>
                <Route path="/my-coupons">
                  <RouteGuard>
                    <MyCouponsPage />
                  </RouteGuard>
                </Route>
                <Route path="/notifications">
                  <RouteGuard>
                    <NotificationsPage />
                  </RouteGuard>
                </Route>
                <Route path="/analytics">
                  <RouteGuard>
                    <AnalyticsPage />
                  </RouteGuard>
                </Route>
                <Route path="/settings">
                  <RouteGuard>
                    <SettingsPage />
                  </RouteGuard>
                </Route>
                <Route path="/activity/:id">
                  <RouteGuard>
                    <ActivityDetailPage />
                  </RouteGuard>
                </Route>
                <Route path="/qr/:couponId">
                  <RouteGuard>
                    <QRCodePage />
                  </RouteGuard>
                </Route>

                {/* 404 route */}
                <Route>
                  <NotFoundPage />
                </Route>
              </Switch>
            </Suspense>
          </div>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;