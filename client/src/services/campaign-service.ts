import { apiClient } from '../lib/api-client';
import type { Campaign, Coupon, APIResponse } from '../types';

interface GetCampaignsParams {
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

class CampaignService {
  async getCampaigns(params?: GetCampaignsParams): Promise<Campaign[]> {
    const searchParams = new URLSearchParams();

    if (params?.lat) searchParams.append('lat', params.lat.toString());
    if (params?.lng) searchParams.append('lng', params.lng.toString());
    if (params?.radius) searchParams.append('radius', params.radius.toString());
    if (params?.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await apiClient.get<APIResponse<Campaign[]>>(
      `/campaigns?${searchParams.toString()}`
    );
    return response.data?.data || [];
  }

  async getCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.get<APIResponse<Campaign>>(`/campaigns/${id}`);
    if (!response.data?.data) {
      throw new Error('Campaign not found');
    }
    return response.data.data;
  }

  async claimCoupon(campaignId: string): Promise<Coupon> {
    const response = await apiClient.post<APIResponse<Coupon>>(
      `/campaigns/${campaignId}/claim`
    );
    if (!response.data?.data) {
      throw new Error('Failed to claim coupon');
    }
    return response.data.data;
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return this.getCampaigns({ category: 'active' });
  }

  async searchCampaigns(query: string, location?: { lat: number; lng: number }): Promise<Campaign[]> {
    return this.getCampaigns({
      search: query,
      lat: location?.lat,
      lng: location?.lng
    });
  }
}

export const campaignService = new CampaignService();