import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Zap, ArrowRight, Shield, MapPin, Users, Sparkles } from "lucide-react";

export default function StartupPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [nearbyCount, setNearbyCount] = useState(0);
  const [locationDetected, setLocationDetected] = useState(false);

  useEffect(() => {
    // Complex loading sequence with multiple steps
    const loadingSequence = [
      { text: "Initializing Earlyshh platform...", duration: 800 },
      { text: "Detecting your location...", duration: 1000 },
      { text: "Scanning for nearby partnerships...", duration: 1200 },
      { text: "Loading exclusive offers...", duration: 800 },
      { text: "Almost ready...", duration: 600 }
    ];

    let currentIndex = 0;
    let totalTime = 0;

    const runSequence = () => {
      if (currentIndex < loadingSequence.length) {
        const current = loadingSequence[currentIndex];
        setLoadingText(current.text);
        
        // Simulate location detection
        if (current.text.includes("location")) {
          navigator.geolocation?.getCurrentPosition(
            () => setLocationDetected(true),
            () => setLocationDetected(false)
          );
        }
        
        // Simulate finding partnerships
        if (current.text.includes("partnerships")) {
          const count = Math.floor(Math.random() * 15) + 8;
          setNearbyCount(count);
        }
        
        totalTime += current.duration;
        setTimeout(() => {
          currentIndex++;
          runSequence();
        }, current.duration);
      } else {
        // Final transition to auth screen
        setTimeout(() => {
          setIsLoading(false);
          setShowAuth(true);
        }, 500);
      }
    };

    runSequence();
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
        {/* Complex particle system */}
        <div className="absolute inset-0">
          {/* Large floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`large-${i}`}
              className="absolute w-4 h-4 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                transform: `translate(${Math.sin(i) * 50}px, ${Math.cos(i) * 50}px)`
              }}
            />
          ))}
          
          {/* Medium particles */}
          {[...Array(40)].map((_, i) => (
            <div
              key={`medium-${i}`}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Small sparkles */}
          {[...Array(60)].map((_, i) => (
            <div
              key={`small-${i}`}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Main loading content */}
        <div className="text-center z-10 space-y-8">
          {/* Logo and brand with animated gradients */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                {/* Animated glow layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 rounded-full blur-sm opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
                <Zap className="relative w-12 h-12 text-yellow-300 animate-bounce filter drop-shadow-lg" style={{ animationDuration: '2s' }} />
              </div>
              
              {/* Animated gradient text */}
              <div className="relative">
                <h1 className="text-5xl font-bold tracking-wide relative">
                  <span 
                    className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse"
                    style={{ animationDuration: '2s' }}
                  >
                    EARLYSHH
                  </span>
                  <span 
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"
                    style={{ 
                      animation: 'gradient-shift 4s ease-in-out infinite',
                      opacity: '0.8'
                    }}
                  >
                    EARLYSHH
                  </span>
                  <span 
                    className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent"
                  >
                    EARLYSHH
                  </span>
                </h1>
                
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 opacity-0"
                  style={{ 
                    animation: 'shimmer 3s ease-in-out infinite',
                    animationDelay: '1s'
                  }}
                />
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <p className="text-xl text-white font-medium tracking-wide">
                Social-First Partnership Platform
              </p>
            </div>
          </div>

          {/* Enhanced loading status with icons */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {loadingText.includes("location") && <MapPin className="w-6 h-6 text-cyan-300 animate-pulse" />}
                {loadingText.includes("partnerships") && <Users className="w-6 h-6 text-pink-300 animate-spin" />}
                {loadingText.includes("offers") && <Sparkles className="w-6 h-6 text-yellow-300 animate-bounce" />}
                <p className="text-lg text-white/90 font-medium">
                  {loadingText}
                </p>
              </div>
              
              {/* Status indicators */}
              <div className="space-y-3">
                {locationDetected && (
                  <div className="flex items-center justify-center space-x-2 text-green-300">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location detected</span>
                  </div>
                )}
                
                {nearbyCount > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-cyan-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{nearbyCount} partnerships found nearby</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced loading animation */}
            <div className="flex justify-center space-x-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '1.2s'
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-64 mx-auto">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${Math.min(100, (loadingText.includes("Almost") ? 90 : loadingText.includes("offers") ? 70 : loadingText.includes("partnerships") ? 50 : loadingText.includes("location") ? 30 : 10))}%` 
                  }}
                />
              </div>
            </div>
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