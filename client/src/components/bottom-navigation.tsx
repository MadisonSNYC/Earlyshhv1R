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
    <nav className="bg-white border-t border-gray-200 px-4 py-2">
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
              className={`flex flex-col items-center py-2 px-3 h-auto ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
