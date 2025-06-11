import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './lib/auth';
import ErrorBoundary from './components/error-boundary';
import GlobalErrorHandler from './components/global-error-handler';
import HomePage from './pages/home';
import OnboardingPage from './pages/onboarding';
import CouponRedeemPage from './pages/coupon-redeem';
import PartnershipConfirmationPage from './pages/partnership-confirmation';
import ProfilePage from './pages/profile';
import MyCouponsPage from './pages/my-coupons';
import NotificationsPage from './pages/notifications';
import AnalyticsPage from './pages/analytics';
import SettingsPage from './pages/settings';
import ActivityDetailPage from './pages/activity-detail';
import NotFoundPage from './pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GlobalErrorHandler />
          <div className="min-h-screen electric-bg">
            <Router>
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
            </Router>
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;