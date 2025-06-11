import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";
import { Ticket, Instagram, AlertTriangle } from "lucide-react";

export default function OnboardingPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInstagramLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate Instagram OAuth flow
      // In a real implementation, this would redirect to Instagram OAuth
      const mockInstagramData = {
        instagramId: "mock_user_" + Date.now(),
        username: "earlyshh_user",
        fullName: "Earlyshh User",
        profilePicUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      };

      await login(mockInstagramData);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Failed to login with Instagram. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 gradient-bg animate-gradient">
          <div className="text-center text-white space-y-6">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <Ticket className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Earlyshh</h1>
            <p className="text-xl opacity-90 max-w-sm">
              Get exclusive coupons for your favorite brands and share your experience on Instagram
            </p>
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className="bg-white p-6 rounded-t-3xl space-y-4">
          {/* Age Verification */}
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Age Verification Required</h3>
              <AlertDescription className="text-gray-600 mt-1">
                You must be 18+ with a public Instagram account to participate
              </AlertDescription>
            </div>
          </Alert>

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Instagram Login Button */}
          <Button
            onClick={handleInstagramLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 px-6 rounded-2xl font-semibold text-lg shadow-lg button-press"
          >
            <Instagram className="w-6 h-6 mr-3" />
            {isLoading ? "Connecting..." : "Continue with Instagram"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
