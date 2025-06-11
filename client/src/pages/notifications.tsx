import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
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
  MoreHorizontal 
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

const iconMap = {
  bell: Bell,
  gift: Gift,
  trophy: Trophy,
  "check-circle": CheckCircle,
  clock: Clock,
  instagram: Instagram,
  star: Star,
  alert: AlertCircle,
  "map-pin": MapPin,
  zap: Zap,
};

function getNotificationIcon(iconName: string) {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Bell;
  return IconComponent;
}

function getNotificationColor(type: string, priority: string) {
  if (priority === "high") return "text-red-500";
  
  switch (type) {
    case "new_deal":
      return "text-blue-500";
    case "achievement":
      return "text-yellow-500";
    case "redemption_confirmed":
      return "text-green-500";
    case "deal_expiring":
      return "text-orange-500";
    case "story_verified":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return format(new Date(date), "MMM d");
}

export default function NotificationsPage() {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/count"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      apiRequest(`/api/notifications/${notificationId}/read`, "PATCH"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/count"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/notifications/read-all", "PATCH"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/count"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6 pt-6">
            <div className="h-8 w-32 bg-purple-600/50 rounded animate-pulse" />
            <div className="h-8 w-20 bg-purple-600/50 rounded animate-pulse" />
          </div>
          
          {/* Notification skeletons */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-morphism rounded-xl p-4 animate-pulse border border-purple-500/30">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-600/50 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-purple-600/50 rounded" />
                  <div className="h-3 w-full bg-purple-600/50 rounded" />
                  <div className="h-3 w-1/4 bg-purple-600/50 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const unreadNotifications = (notifications || []).filter((n: Notification) => !n.isRead);
  const readNotifications = (notifications || []).filter((n: Notification) => n.isRead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header with EARLYSHH Branding */}
        <div className="flex items-center justify-between mb-6 pt-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-2xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                EARLYSHH
              </div>
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Partnership Updates</h1>
            <p className="text-sm text-purple-200 mt-1">
              {unreadNotifications.length} new update{unreadNotifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="border-purple-400 text-purple-200 hover:bg-purple-700/50"
            >
              {markAllAsReadMutation.isPending ? "Marking..." : "Mark all read"}
            </Button>
          )}
        </div>

        {/* Empty state */}
        {(!notifications || notifications.length === 0) && (
          <div className="text-center py-12 glass-morphism rounded-3xl border border-purple-500/30">
            <Bell className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No updates yet</h3>
            <p className="text-purple-200">You'll see partnership updates and activity here.</p>
          </div>
        )}

        {/* Notifications */}
        <div className="space-y-4">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                New Updates
              </h2>
              <div className="space-y-3">
                {unreadNotifications.map((notification: Notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    isUnread={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Separator */}
          {unreadNotifications.length > 0 && readNotifications.length > 0 && (
            <Separator className="my-6 bg-purple-600" />
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div>
              {unreadNotifications.length > 0 && (
                <h2 className="text-lg font-semibold text-purple-300 mb-4">Earlier</h2>
              )}
              <div className="space-y-3">
                {readNotifications.map((notification: Notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    isUnread={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  isUnread: boolean;
}

function NotificationItem({ notification, onClick, isUnread }: NotificationItemProps) {
  const IconComponent = getNotificationIcon(notification.icon);
  const timeAgo = getTimeAgo(notification.createdAt);

  // Get icon background color based on notification type
  const getIconBgColor = (type: string) => {
    switch (type) {
      case "new_deal":
        return "bg-blue-500";
      case "achievement":
        return "bg-yellow-500";
      case "reminder":
        return "bg-purple-500";
      case "partnership":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div 
      className={cn(
        "glass-morphism rounded-xl p-4 border border-purple-500/30 cursor-pointer transition-all duration-200 hover:border-purple-400/50",
        isUnread ? "bg-purple-800/20" : "bg-purple-900/10"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
          getIconBgColor(notification.type)
        )}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold",
                isUnread ? "text-white" : "text-purple-200"
              )}>
                {notification.title}
              </h3>
              <p className={cn(
                "text-sm mt-1 line-clamp-2",
                isUnread ? "text-purple-100" : "text-purple-300"
              )}>
                {notification.message}
              </p>
            </div>
            
            {/* Time and priority */}
            <div className="flex flex-col items-end space-y-1">
              <span className="text-xs text-purple-400">{timeAgo}</span>
              {notification.priority === "high" && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}