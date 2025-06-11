
import { storage } from "../storage";
import type { Notification, InsertNotification } from "@shared/schema";

export class NotificationBusiness {
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await storage.getUserNotifications(userId);
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return await storage.getUnreadNotifications(userId);
  }

  async getNotificationCount(userId: number): Promise<number> {
    return await storage.getUnreadNotificationCount(userId);
  }

  async markNotificationAsRead(notificationId: number, userId: number): Promise<Notification> {
    const notification = await storage.getNotification(notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    return await storage.markNotificationAsRead(notificationId);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await storage.markAllNotificationsAsRead(userId);
  }

  async createNotification(data: InsertNotification): Promise<Notification> {
    return await storage.createNotification(data);
  }

  validateNotificationAccess(notification: Notification | null, userId: number): { valid: boolean; error?: string } {
    if (!notification) {
      return { valid: false, error: "Notification not found" };
    }
    if (notification.userId !== userId) {
      return { valid: false, error: "Unauthorized access to notification" };
    }
    return { valid: true };
  }
}

export const notificationBusiness = new NotificationBusiness();
