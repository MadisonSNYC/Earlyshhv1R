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
    { path: "/", icon: Home, label: "Home" },
    { path: "/my-coupons", icon: Ticket, label: "Coupons" },
    { path: "/notifications", icon: Bell, label: "Activity", hasBadge: true },
    { path: "/analytics", icon: BarChart3, label: "Stats" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-white/10 px-4 py-2 mobile-safe-area z-50">
      <div className="flex justify-around">
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
              className={`relative flex flex-col items-center py-3 px-3 h-auto mobile-touch transition-all ${
                isActive 
                  ? "text-pink-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 mb-1 ${isActive ? "scale-110" : ""}`} />
                {showBadge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center min-w-4"
                  >
                    {(unreadCount?.count || 0) > 99 ? "99+" : unreadCount?.count}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-space font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
