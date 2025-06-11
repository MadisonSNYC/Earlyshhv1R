
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { useAuth } from '../lib/auth';
import { useToast } from './use-toast';

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationService.getNotifications(),
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds for notifications
  });

  const unreadCount = query.data?.filter(n => !n.read).length || 0;

  return {
    ...query,
    unreadCount,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });
}
