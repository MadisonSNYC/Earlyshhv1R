import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Ticket, BarChart3, User, Bell } from "lucide-react";

import { Home, Search, User, Bell, Settings } from 'lucide-react';
import { useLocation as useRouterLocation } from 'wouter';
import { Badge } from './ui/badge';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { useAuth } from '../lib/auth';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/notifications', icon: Bell, label: 'Notifications', showBadge: true },
  { href: '/profile', icon: User, label: 'Profile' }
];

export default function BottomNavigation() {
  const [location] = useRouterLocation();
  const { user } = useAuth();

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['notification-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-morphism border-t border-white/10">
        <div className="flex items-center justify-around py-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-400 bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.showBadge && notificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 bg-red-500 text-xs flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}