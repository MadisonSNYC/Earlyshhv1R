
import { User } from '@shared/schema';

export class ApiClient {
  private baseUrl: string;
  private user: User | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  setUser(user: User | null) {
    this.user = user;
  }

  private async request(method: string, endpoint: string, data?: any, requiresAuth: boolean = true) {
    if (requiresAuth && !this.user) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      if (method === 'GET') {
        // Add userId to query params for GET requests
        const params = new URLSearchParams();
        if (requiresAuth && this.user) {
          params.set('userId', this.user.id.toString());
        }
        Object.keys(data).forEach(key => {
          params.set(key, data[key]);
        });
        const queryString = params.toString();
        return fetch(`${url}${queryString ? `?${queryString}` : ''}`, config);
      } else {
        // Add userId to body for other requests
        config.body = JSON.stringify({
          ...data,
          ...(requiresAuth && this.user ? { userId: this.user.id } : {})
        });
      }
    } else if (method === 'GET' && requiresAuth && this.user) {
      // Add userId to query params for GET requests without other data
      return fetch(`${url}?userId=${this.user.id}`, config);
    }

    return fetch(url, config);
  }

  // Campaign methods
  async getCampaigns() {
    const response = await this.request('GET', '/api/campaigns', {}, false);
    return response.json();
  }

  async getCampaign(id: number) {
    const response = await this.request('GET', `/api/campaigns/${id}`, {}, false);
    return response.json();
  }

  async claimCoupon(campaignId: number) {
    const response = await this.request('POST', `/api/campaigns/${campaignId}/claim`);
    return response.json();
  }

  // User methods
  async getUserCoupons() {
    if (!this.user) throw new Error('User not authenticated');
    const response = await this.request('GET', `/api/users/${this.user.id}/coupons`, {}, false);
    return response.json();
  }

  async getUserStats() {
    if (!this.user) throw new Error('User not authenticated');
    const response = await this.request('GET', `/api/users/${this.user.id}/stats`, {}, false);
    return response.json();
  }

  // Coupon methods
  async getCoupon(id: number) {
    const response = await this.request('GET', `/api/coupons/${id}`, {}, false);
    return response.json();
  }

  async redeemCoupon(id: number) {
    const response = await this.request('PATCH', `/api/coupons/${id}/redeem`);
    return response.json();
  }

  // Notification methods
  async getNotifications() {
    const response = await this.request('GET', '/api/notifications');
    return response.json();
  }

  async getUnreadNotifications() {
    const response = await this.request('GET', '/api/notifications/unread');
    return response.json();
  }

  async getNotificationCount() {
    const response = await this.request('GET', '/api/notifications/count');
    return response.json();
  }

  async markNotificationAsRead(id: number) {
    const response = await this.request('PATCH', `/api/notifications/${id}/read`);
    return response.json();
  }

  async markAllNotificationsAsRead() {
    const response = await this.request('PATCH', '/api/notifications/read-all');
    return response.json();
  }

  async createNotification(data: any) {
    const response = await this.request('POST', '/api/notifications', data);
    return response.json();
  }

  // Story methods
  async createStory(data: any) {
    const response = await this.request('POST', '/api/stories', data);
    return response.json();
  }

  // Analytics methods
  async getCampaignAnalytics() {
    const response = await this.request('GET', '/api/analytics/campaigns', {}, false);
    return response.json();
  }

  // Auth methods
  async login(instagramData: any) {
    const response = await this.request('POST', '/api/auth/instagram', instagramData, false);
    return response.json();
  }
}

export const apiClient = new ApiClient();
