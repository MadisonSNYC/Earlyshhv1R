import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Ticket, BarChart3, User } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/my-coupons", icon: Ticket, label: "My Coupons" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-white/10 px-4 py-2 mobile-safe-area z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-3 px-3 h-auto mobile-touch transition-all ${
                isActive 
                  ? "text-pink-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-space font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
