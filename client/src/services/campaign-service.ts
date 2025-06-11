
import { apiClient } from '@/lib/api-client';

export interface Campaign {
  id: number;
  brandName: string;
  brandIgHandle: string;
  offerDescription: string;
  productName: string;
  brandLogoUrl: string;
  redeemableAmount: string;
  startDate: string;
  endDate: string;
  maxCoupons: number;
  perUserLimit: number;
  status: string;
  latitude: string;
  longitude: string;
  radius: string;
  category: string;
  claimedCount?: number;
  redeemedCount?: number;
  availableCount?: number;
}

export class CampaignService {
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await apiClient.getCampaigns();
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCampaignById(id: number): Promise<Campaign> {
    try {
      const response = await apiClient.getCampaign(id);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaign ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async claimCampaignCoupon(campaignId: number) {
    try {
      const response = await apiClient.claimCoupon(campaignId);
      return response;
    } catch (error) {
      throw new Error(`Failed to claim coupon for campaign ${campaignId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCampaignAnalytics() {
    try {
      const response = await apiClient.getCampaignAnalytics();
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaign analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const campaignService = new CampaignService();
