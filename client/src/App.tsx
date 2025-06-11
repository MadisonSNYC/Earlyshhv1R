import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";

import OnboardingPage from "@/pages/onboarding";
import HomePage from "@/pages/home";
import MyCouponsPage from "@/pages/my-coupons";
import AnalyticsPage from "@/pages/analytics";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/my-coupons" component={MyCouponsPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
