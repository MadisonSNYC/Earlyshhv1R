import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export default function StartupPage() {
  const [, setLocation] = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [navigated, setNavigated] = useState(false);

  // Simple 2-second delay before showing auth options
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuth(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInstagramLogin = () => {
    // Instagram OAuth would go here
    setNavigated(true);
    setTimeout(() => setLocation('/home'), 1500);
  };

  const handleExploreWithoutAccount = () => {
    setNavigated(true);
    setTimeout(() => setLocation('/onboarding'), 1500);
  };

  // Show success state when navigated
  if (navigated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 flex items-center justify-center relative overflow-hidden iphone-container">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
        
        <div className="relative z-10 text-center space-812-xl">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-812-title font-black text-white tracking-tight">Welcome to Earlyshh!</h2>
          <p className="text-gray-300 text-812-lg font-medium">Your partnership dashboard awaits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 relative overflow-hidden iphone-container">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-12">
        {/* Logo Section */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            <span 
              className="bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent"
              style={{
                backgroundSize: '300% 300%',
                animation: 'prominentGradient 4s ease-in-out infinite'
              }}
            >
              EARLYSHH
            </span>
          </h1>
          
          <p className="text-gray-300 text-base font-medium">
            Your neighborhood partnership awaits
          </p>
        </div>

        {/* Auth Section */}
        <div className={`space-y-6 transition-all duration-1000 ${showAuth ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Primary Action */}
          <Button 
            onClick={handleInstagramLogin}
            className="touch-button w-full bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 hover:from-pink-500 hover:via-purple-600 hover:to-cyan-500 text-white font-semibold rounded-3xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30"
          >
            <Instagram className="w-5 h-5 mr-3" />
            Join with Instagram
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px bg-gray-600 flex-1" />
            <span className="text-gray-400 text-sm px-3">or</span>
            <div className="h-px bg-gray-600 flex-1" />
          </div>
          
          {/* Secondary Action */}
          <Button 
            onClick={handleExploreWithoutAccount}
            className="touch-button w-full bg-transparent border border-purple-400/50 text-purple-200 hover:bg-purple-400/10 hover:text-purple-100 hover:border-purple-400 font-medium rounded-2xl transition-all duration-300"
          >
            Explore Without Account
          </Button>
        </div>

        {/* Bottom Terms */}
        <div className="pt-8">
          <p className="text-gray-400 text-xs text-center leading-relaxed">
            By joining, you confirm you are 18+ and agree to our Partnership Terms.
          </p>
        </div>
      </div>
    </div>
  );
}