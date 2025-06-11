
import { apiClient } from '@/lib/api-client';

export interface Notification {
  id: number;
  userId: number;
  type: 'new_deal' | 'achievement' | 'redemption_confirmed' | 'deal_expiring' | 'story_verified';
  title: string;
  message: string;
  icon: string;
  actionUrl: string | null;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  metadata: any;
  createdAt: string;
  readAt: string | null;
}

export class NotificationService {
  async getAllNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.getNotifications();
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.getUnreadNotifications();
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch unread notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNotificationCount(): Promise<number> {
    try {
      const response = await apiClient.getNotificationCount();
      return response.count;
    } catch (error) {
      throw new Error(`Failed to fetch notification count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async markAsRead(id: number): Promise<void> {
    try {
      await apiClient.markNotificationAsRead(id);
    } catch (error) {
      throw new Error(`Failed to mark notification ${id} as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.markAllNotificationsAsRead();
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    try {
      const response = await apiClient.createNotification(data);
      return response;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getNotificationIcon(type: Notification['type']): string {
    const iconMap = {
      new_deal: 'gift',
      achievement: 'trophy',
      redemption_confirmed: 'check-circle',
      deal_expiring: 'clock',
      story_verified: 'instagram'
    };
    return iconMap[type] || 'bell';
  }

  formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

export const notificationService = new NotificationService();
