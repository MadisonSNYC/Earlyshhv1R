
import { apiClient } from '@/lib/api-client';

export interface UserStats {
  claimed: number;
  redeemed: number;
  shared: number;
}

export interface User {
  id: number;
  instagramId: string;
  username: string;
  fullName: string;
  profilePicUrl: string | null;
  ageVerified: boolean;
  accessToken: string | null;
  createdAt: string;
  lastLogin: string;
}

export class UserService {
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiClient.getUserStats();
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async loginWithInstagram(instagramData: {
    instagramId: string;
    username: string;
    fullName: string;
    profilePicUrl?: string;
  }): Promise<{ user: User; message: string }> {
    try {
      const response = await apiClient.login(instagramData);
      return response;
    } catch (error) {
      throw new Error(`Failed to login with Instagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateInstagramHandle(handle: string): boolean {
    // Basic Instagram handle validation
    const handlePattern = /^[a-zA-Z0-9._]{1,30}$/;
    return handlePattern.test(handle);
  }

  formatUserDisplayName(user: User): string {
    return user.fullName || user.username || 'Unknown User';
  }

  getUserInitials(user: User): string {
    const name = this.formatUserDisplayName(user);
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  calculateUserLevel(stats: UserStats): { level: number; progress: number } {
    // Simple leveling system based on total activities
    const totalActivities = stats.claimed + stats.redeemed + stats.shared;
    const level = Math.floor(totalActivities / 10) + 1;
    const progress = (totalActivities % 10) * 10;
    
    return { level, progress };
  }
}

export const userService = new UserService();
