import { useEffect, useState } from "react";

export function LoadingScreen() {
  // Component implementation stays the same
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 electric-bg flex flex-col items-center justify-center z-50">
      {/* Animated Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 earlyshh-gradient rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
          <div className="text-4xl font-rubik font-black text-white tracking-tight">
            E
          </div>
        </div>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 w-24 h-24 earlyshh-gradient rounded-3xl animate-ping opacity-20"></div>
        <div className="absolute inset-2 w-20 h-20 earlyshh-gradient rounded-3xl animate-ping opacity-10 animation-delay-200"></div>
      </div>

      {/* Brand Name */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-rubik font-black earlyshh-text-gradient mb-2">
          Earlyshh
        </h1>
        <p className="text-gray-300 font-space text-sm tracking-wide">
          Discover. Access. Share.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 bg-white/10 rounded-full h-1 mb-4 overflow-hidden">
        <div 
          className="h-full earlyshh-gradient transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading Text */}
      <div className="text-gray-400 font-space text-xs animate-pulse">
        Loading your discoveries...
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-500 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-float-delayed opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float-delayed opacity-30"></div>
      </div>
    </div>
  );
}