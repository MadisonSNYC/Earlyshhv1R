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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          
          {/* Notification skeletons */}
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const unreadNotifications = (notifications || []).filter((n: Notification) => !n.isRead);
  const readNotifications = (notifications || []).filter((n: Notification) => n.isRead);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-gray-900 dark:text-white" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Activity
            </h1>
            {(unreadCount?.count || 0) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount?.count || 0}
              </Badge>
            )}
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-blue-600 hover:text-blue-700"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Empty state */}
        {(!notifications || notifications.length === 0) && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              When brands send you deals or when you achieve milestones, they'll appear here.
            </p>
          </div>
        )}

        {/* Notifications */}
        <div className="space-y-4">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                New
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
            <Separator className="my-6" />
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div>
              {unreadNotifications.length > 0 && (
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Earlier
                </h2>
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
  const iconColor = getNotificationColor(notification.type, notification.priority);
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
        isUnread 
          ? "bg-blue-50 dark:bg-blue-950/20 border-l-blue-500 shadow-sm" 
          : "bg-white dark:bg-gray-800 border-l-transparent hover:border-l-gray-300"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            isUnread ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-700"
          )}>
            <IconComponent className={cn("w-5 h-5", iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={cn(
                  "text-sm font-semibold",
                  isUnread 
                    ? "text-gray-900 dark:text-white" 
                    : "text-gray-700 dark:text-gray-300"
                )}>
                  {notification.title}
                </h3>
                <p className={cn(
                  "text-sm mt-1 line-clamp-2",
                  isUnread 
                    ? "text-gray-700 dark:text-gray-300" 
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {notification.message}
                </p>
              </div>
              
              {/* Priority indicator */}
              {notification.priority === "high" && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              <span className={cn(
                "text-xs",
                isUnread 
                  ? "text-gray-600 dark:text-gray-400" 
                  : "text-gray-400 dark:text-gray-500"
              )}>
                {timeAgo}
              </span>
              
              {/* Type badge */}
              <Badge 
                variant="secondary" 
                className="text-xs"
              >
                {notification.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}