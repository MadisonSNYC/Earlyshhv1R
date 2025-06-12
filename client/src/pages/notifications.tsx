import { useQuery, useMutation } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  Gift, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Instagram, 
  Star,
  AlertCircle,
  MapPin,
  Zap,
  MoreHorizontal,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/bottom-navigation";
import type { Notification } from "@shared/schema";

export default function NotificationsPage() {
  const { toast } = useToast();
  const userId = 1; // Hardcoded for MVP

  // Use mock notifications data that matches the screenshot design
  const mockNotifications = [
    {
      id: 1,
      type: "new_deal",
      title: "New Deal Alert!",
      message: "SuperRoot Energy just dropped a free sample offer near you",
      icon: "🎁",
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5m ago
      isRead: false,
      priority: "normal"
    },
    {
      id: 2,
      type: "expiry_warning",
      title: "Deal Expires Soon",
      message: "Your Glow Beauty face mask coupon expires in 2 hours",
      icon: "⏰",
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10m ago
      isRead: false,
      priority: "normal"
    },
    {
      id: 3,
      type: "achievement",
      title: "First Coupon Claimed!",
      message: "You've claimed your first early access deal. Keep exploring!",
      icon: "🏆",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30m ago
      isRead: false,
      priority: "normal"
    },
    {
      id: 4,
      type: "redemption_success",
      title: "Deal Redeemed Successfully!",
      message: "Your SuperRoot Energy coupon was redeemed at Brooklyn Store",
      icon: "✅",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      isRead: true,
      priority: "normal"
    },
    {
      id: 5,
      type: "story_verified",
      title: "Story Verified!",
      message: "Your Instagram story for SuperRoot Energy has been verified",
      icon: "📱",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1d ago
      isRead: true,
      priority: "normal"
    }
  ];

  const { data: notifications = mockNotifications, isLoading } = useQuery({
    queryKey: ["/api/notifications", { userId }],
    enabled: false, // Use mock data for now
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return apiRequest(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/notifications/mark-all-read`, {
        method: "POST",
        body: { userId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/count"] });
      toast({
        title: "All notifications marked as read",
        description: "Your notifications have been updated.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const newNotifications = notifications.filter((n: any) => !n.isRead);
  const earlierNotifications = notifications.filter((n: any) => n.isRead);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h1 className="text-2xl font-bold text-white">EARLYSHH</h1>
              <h2 className="text-xl font-semibold text-white/90">Partnership Updates</h2>
              <p className="text-white/70 text-sm">{newNotifications.length} new updates</p>
            </div>
          </div>
          <Button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending || newNotifications.length === 0}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            size="sm"
          >
            Mark all read
          </Button>
        </div>

        {/* New Updates */}
        {newNotifications.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <h3 className="text-white font-semibold">New Updates</h3>
            </div>
            
            <div className="space-y-3">
              {newNotifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-white/60 text-xs">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earlier Updates */}
        {earlierNotifications.length > 0 && (
          <div>
            <h3 className="text-white/70 font-semibold mb-4">Earlier</h3>
            
            <div className="space-y-3">
              {earlierNotifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-2xl opacity-70">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white/90 font-semibold text-lg mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-white/50 text-xs">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
            <p className="text-white/70">
              You'll see updates about new deals, achievements, and more here.
            </p>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}