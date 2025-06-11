import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";

import LoadingScreen from "@/components/loading-screen";
import OnboardingPage from "@/pages/onboarding";
import HomePage from "@/pages/home";
import MyCouponsPage from "@/pages/my-coupons";
import AnalyticsPage from "@/pages/analytics";
import ProfilePage from "@/pages/profile";
import CouponRedeemPage from "@/pages/coupon-redeem";
import NotificationsPage from "@/pages/notifications";
import PartnershipConfirmationPage from "@/pages/partnership-confirmation";
import SettingsPage from "@/pages/settings";
import ActivityDetailPage from "@/pages/activity-detail";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/my-coupons" component={MyCouponsPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/redeem/:couponId" component={CouponRedeemPage} />
      <Route path="/partnership-confirmation" component={PartnershipConfirmationPage} />
      <Route path="/activity/:id" component={ActivityDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <OnboardingPage />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
