import React, { Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';

import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './lib/auth';
import { ErrorBoundary } from './components/error-boundary';
import GlobalErrorHandler from './components/global-error-handler';
import LoadingScreen from './components/loading-screen';
import { BundleAnalyzer, markModuleAsUsed } from './lib/bundle-analyzer';

// Lazy load pages with better chunk names
const StartupPage = React.lazy(() => import(/* webpackChunkName: "startup" */ './pages/startup'));
const HomePage = React.lazy(() => import(/* webpackChunkName: "home" */ './pages/home'));
const OnboardingPage = React.lazy(() => import(/* webpackChunkName: "onboarding" */ './pages/onboarding'));
const PartnershipDetailPage = React.lazy(() => import(/* webpackChunkName: "partnership-detail" */ './pages/partnership-detail'));
const PartnershipConfirmationPage = React.lazy(() => import(/* webpackChunkName: "partnership" */ './pages/partnership-confirmation'));
const ProfilePage = React.lazy(() => import(/* webpackChunkName: "profile" */ './pages/profile'));
const ProfileDemoPage = React.lazy(() => import(/* webpackChunkName: "profile-demo" */ './pages/profile-demo'));
const MyCouponsPage = React.lazy(() => import(/* webpackChunkName: "my-coupons" */ './pages/my-coupons'));
const PartnershipsPage = React.lazy(() => import(/* webpackChunkName: "partnerships" */ './pages/partnerships'));
const NotificationsPage = React.lazy(() => import(/* webpackChunkName: "notifications" */ './pages/notifications'));
const AnalyticsPage = React.lazy(() => import(/* webpackChunkName: "analytics" */ './pages/analytics'));
const SettingsPage = React.lazy(() => import(/* webpackChunkName: "settings" */ './pages/settings'));
const GamificationPage = React.lazy(() => import(/* webpackChunkName: "gamification" */ './pages/gamification'));
const ActivityDetailPage = React.lazy(() => import(/* webpackChunkName: "activity" */ './pages/activity-detail'));
const QRCodePage = React.lazy(() => import(/* webpackChunkName: "qr-code" */ './pages/qr-code'));
const InstagramStoryPage = React.lazy(() => import(/* webpackChunkName: "instagram-story" */ './pages/instagram-story'));
const SurveyPage = React.lazy(() => import(/* webpackChunkName: "survey" */ './pages/survey'));
const BrandProfilePage = React.lazy(() => import(/* webpackChunkName: "brand-profile" */ './pages/brand-profile'));
const BrandAboutPage = React.lazy(() => import(/* webpackChunkName: "brand-about" */ './pages/brand-about'));
const MapPage = React.lazy(() => import(/* webpackChunkName: "map" */ './pages/map'));
const ProductConfirmationPage = React.lazy(() => import(/* webpackChunkName: "product-confirmation" */ './pages/product-confirmation'));
const PartnershipQRPage = React.lazy(() => import(/* webpackChunkName: "partnership-qr" */ './pages/partnership-qr'));
const PartnershipLoadingPage = React.lazy(() => import(/* webpackChunkName: "partnership-loading" */ './pages/partnership-loading'));
const NotFoundPage = React.lazy(() => import(/* webpackChunkName: "not-found" */ './pages/not-found'));

// Authenticated app wrapper
function AuthenticatedApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="loading-skeleton w-8 h-8 rounded-full"></div></div>;
  }

  return (
    <Switch>
      <Route path="/startup" component={StartupPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/" component={HomePage} />
      <Route path="/partnership/:id" component={PartnershipDetailPage} />
      <Route path="/partnership-confirmation/:id" component={PartnershipConfirmationPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profile-demo" component={ProfileDemoPage} />
      <Route path="/my-coupons" component={MyCouponsPage} />
      <Route path="/partnerships" component={PartnershipsPage} />
      <Route path="/coupon/:couponId" component={PartnershipsPage} />
      <Route path="/map" component={MapPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/activity/:id" component={ActivityDetailPage} />
      <Route path="/qr/:couponId" component={QRCodePage} />
      <Route path="/qr-code/:couponId" component={QRCodePage} />
      <Route path="/qr-code" component={QRCodePage} />
      <Route path="/instagram-story/:couponId" component={InstagramStoryPage} />
      <Route path="/survey/:couponId" component={SurveyPage} />
      <Route path="/brand/:brandId" component={BrandProfilePage} />
      <Route path="/brand/:id" component={BrandAboutPage} />
      <Route path="/gamification" component={GamificationPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

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
          <>
            <div className="earlyshh-bg"></div>
            <div className="min-h-screen iphone-container iphone-safe-area relative z-10">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="loading-skeleton w-8 h-8 rounded-full"></div></div>}>
                <AuthenticatedApp />
              </Suspense>
              <Toaster />
            </div>
          </>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;