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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
        
        <div className="relative z-10 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome to Earlyshh!</h2>
          <p className="text-gray-300 text-xl font-medium">Your partnership dashboard awaits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        {/* Logo with prominent animated gradient */}
        <div className="space-y-6">
          <h1 className="text-7xl font-black tracking-tight relative">
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
          
          <p className="text-gray-300 text-xl font-medium tracking-wide">
            Your neighborhood partnership awaits
          </p>
        </div>

        {/* Auth Section - appears after delay */}
        <div className={`space-y-6 transition-all duration-1000 ${showAuth ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Instagram Login Button */}
          <Button 
            onClick={handleInstagramLogin}
            className="w-full h-14 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 hover:from-pink-500 hover:via-purple-600 hover:to-cyan-500 text-white font-semibold text-lg rounded-3xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/30"
          >
            <Instagram className="w-6 h-6 mr-3" />
            Join with Instagram
          </Button>

          {/* Dev Mode Section */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-px bg-cyan-400 flex-1" />
              <span className="text-cyan-400 text-sm font-medium px-3">Dev Mode Bypass</span>
              <div className="h-px bg-cyan-400 flex-1" />
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username (test)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 bg-gray-800/50 border border-gray-600 rounded-2xl px-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-800 transition-all"
              />
              
              <Button 
                onClick={handleDevBypass}
                disabled={!username.trim()}
                className="w-full h-12 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-400/30"
              >
                Bypass Login
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