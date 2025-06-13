import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export default function StartupPage() {
  const [, setLocation] = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [username, setUsername] = useState("");
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

  const handleDevBypass = () => {
    if (username.trim()) {
      setNavigated(true);
      setTimeout(() => setLocation('/home'), 1500);
    }
  };

  // Show success state when navigated
  if (navigated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 flex items-center justify-center relative overflow-hidden iphone-container">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
        
        <div className="relative z-10 text-center space-375-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-375-lg font-black text-white tracking-tight">Welcome to Earlyshh!</h2>
          <p className="text-gray-300 text-375-base font-medium">Your partnership dashboard awaits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden iphone-container">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      <div className="relative z-10 text-center w-full space-375-lg">
        {/* Logo with prominent animated gradient - optimized for 375px */}
        <div className="space-375-md">
          <h1 className="text-5xl font-black tracking-tight relative">
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
          
          <p className="text-gray-300 text-375-base font-medium tracking-wide px-4">
            Your neighborhood partnership awaits
          </p>
        </div>

        {/* Auth Section - appears after delay */}
        <div className={`space-375-md transition-all duration-1000 ${showAuth ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Instagram Login Button - optimized for touch */}
          <Button 
            onClick={handleInstagramLogin}
            className="touch-button w-full bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 hover:from-pink-500 hover:via-purple-600 hover:to-cyan-500 text-white font-semibold rounded-3xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30"
          >
            <Instagram className="w-5 h-5 mr-3" />
            Join with Instagram
          </Button>

          {/* Dev Mode Section - iPhone optimized */}
          <div className="space-375-sm pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-px bg-cyan-400 flex-1" />
              <span className="text-cyan-400 text-375-xs font-medium px-3">Dev Mode Options</span>
              <div className="h-px bg-cyan-400 flex-1" />
            </div>
            
            <div className="space-375-xs">
              <input
                type="text"
                placeholder="Username (test)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="touch-button w-full bg-gray-800/50 border border-gray-600 rounded-2xl px-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-800 transition-all"
              />
              
              <Button 
                onClick={handleDevBypass}
                disabled={!username.trim()}
                className="touch-button w-full bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-400/30"
              >
                Skip to Home
              </Button>
              
              <Button 
                onClick={() => setLocation('/onboarding')}
                className="touch-button w-full bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/30"
              >
                Test Onboarding Flow
              </Button>
            </div>
          </div>

          {/* Partnership Terms */}
          <p className="text-gray-400 text-sm leading-relaxed pt-4">
            By joining, you confirm you are 18+ and agree to our Partnership Terms.
          </p>
        </div>
      </div>


    </div>
  );
}