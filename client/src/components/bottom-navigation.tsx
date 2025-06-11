import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Ticket, BarChart3, User, Bell } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/count"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const navItems = [
    { path: "/", icon: Home, label: "Discover" },
    { path: "/my-coupons", icon: Ticket, label: "My Passes" },
    { path: "/notifications", icon: Bell, label: "Activity", hasBadge: true },
    { path: "/analytics", icon: BarChart3, label: "Partnerships" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-white/10 px-2 py-2 mobile-safe-area z-50">
      <div className="flex justify-center">
        <div className="flex justify-between max-w-sm w-full">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            const showBadge = item.hasBadge && (unreadCount?.count || 0) > 0;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => setLocation(item.path)}
                className={`relative flex flex-col items-center py-2 px-2 h-auto mobile-touch transition-all min-w-0 flex-1 ${
                  isActive 
                    ? "text-pink-500" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="relative">
                  <Icon className={`h-4 w-4 mb-1 ${isActive ? "scale-110" : ""}`} />
                  {showBadge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-3 w-3 p-0 text-xs flex items-center justify-center min-w-3"
                    >
                      {(unreadCount?.count || 0) > 9 ? "9+" : unreadCount?.count}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-space font-medium truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
