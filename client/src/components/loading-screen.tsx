import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen earlyshh-bg flex flex-col items-center justify-center">
      <div className="glass-card p-8 rounded-3xl flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 animate-pulse" />
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-bounce" />
        </div>
        
        <div className="text-center">
          <p className="text-white text-lg font-medium">{message}</p>
          <p className="text-gray-300 text-sm mt-2">Please wait a moment...</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
            style={{
              width: '50%',
              animation: 'loading 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </div>
  );
}