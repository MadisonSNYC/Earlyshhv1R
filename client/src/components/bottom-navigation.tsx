import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, User, Bell, Map, QrCode, Heart } from "lucide-react";

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/partnerships', icon: Heart, label: 'Partnerships' },
  { href: '/qr-code', icon: QrCode, label: 'QR Code' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' }
];

export default function BottomNavigation() {
  const [location] = useLocation();

  // Get notification count
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['/api/notifications/count'],
    queryFn: async () => {
      const response = await fetch('/api/notifications/count');
      if (!response.ok) return 0;
      return response.json();
    }
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800/50 z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex items-center justify-between space-x-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            const isQRCode = item.label === 'QR Code';
            
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full flex flex-col items-center space-y-1 h-auto py-2 px-1 transition-all duration-200 ${
                    isQRCode
                      ? isActive 
                        ? 'text-white bg-gradient-to-r from-purple-500/80 to-cyan-500/80 shadow-lg border border-purple-400/50' 
                        : 'text-gray-300 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 border border-purple-400/30 shadow-md transform hover:scale-105'
                      : isActive 
                        ? 'text-cyan-400 bg-cyan-400/10' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`${isQRCode ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    {item.label === 'Notifications' && notificationCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center min-w-0 animate-pulse"
                      >
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </Badge>
                    )}
                    {isQRCode && !isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg animate-pulse" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isQRCode ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}