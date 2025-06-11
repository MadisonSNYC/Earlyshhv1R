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
    <div className="min-h-screen">
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 earlyshh-gradient">
          <div className="text-center text-white space-y-6">
            <div className="w-24 h-24 mx-auto glass-morphism rounded-3xl flex items-center justify-center">
              <Ticket className="h-12 w-12 text-white" />
            </div>
            <h1 className="earlyshh-brand-title text-5xl">EARLYSHH</h1>
            <p className="text-xl opacity-90 max-w-sm font-space font-light">
              Electric playground for exclusive deals. Claim, redeem, share your story.
            </p>
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className="glass-morphism p-6 rounded-t-3xl space-y-4 border-t border-white/20">
          {/* Age Verification */}
          <Alert className="glass-morphism border-orange-400/30 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <div>
              <h3 className="font-rubik font-semibold text-white">Age Verification Required</h3>
              <AlertDescription className="text-gray-300 mt-1 font-space">
                You must be 18+ with a public Instagram account to participate
              </AlertDescription>
            </div>
          </Alert>

          {error && (
            <Alert className="glass-morphism border-red-400/30 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300 font-space">{error}</AlertDescription>
            </Alert>
          )}

          {/* Instagram Login Button */}
          <Button
            onClick={handleInstagramLogin}
            disabled={isLoading}
            className="btn-electric w-full py-6 px-6 rounded-2xl text-lg shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <Instagram className="w-6 h-6 mr-3" />
            {isLoading ? "Connecting..." : "Continue with Instagram"}
          </Button>

          <p className="text-center text-sm text-gray-400 font-space">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
