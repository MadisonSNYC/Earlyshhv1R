import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Zap, ArrowRight, Shield } from "lucide-react";

export default function StartupPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Show loading screen for 2 seconds, then show auth options
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowAuth(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstagramLogin = () => {
    // This would integrate with Instagram's OAuth in production
    // For now, redirect to onboarding
    setLocation("/onboarding");
  };

  const handleDevBypass = () => {
    // Quick bypass for development
    setLocation("/home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="text-center z-10">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">EARLYSHH</h1>
            </div>
          </div>

          {/* Loading message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-white/90 text-lg font-medium">
              Loading exclusive partnerships near you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">EARLYSHH</h1>
            </div>
            <p className="text-white/80 text-sm">
              Discover exclusive partnerships near you
            </p>
          </div>

          {/* Authentication Options */}
          <div className="space-y-4">
            {/* Instagram Login */}
            <Button
              onClick={handleInstagramLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-12 text-lg font-semibold"
            >
              <Instagram className="w-5 h-5 mr-3" />
              Continue with Instagram
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Privacy note */}
            <div className="flex items-center justify-center space-x-2 text-white/70 text-xs">
              <Shield className="w-3 h-3" />
              <span>Your data is secure and private</span>
            </div>

            {/* Dev Bypass */}
            <div className="pt-4 border-t border-white/20">
              <Button
                onClick={handleDevBypass}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                Dev Bypass - Enter App
              </Button>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-xs">
              By continuing, you agree to our{" "}
              <span className="text-white/80 underline cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-white/80 underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}