
import { storage } from "../storage";
import type { Campaign, InsertCoupon } from "@shared/schema";

export class CampaignBusiness {
  async getAllCampaignsWithStats(): Promise<Array<Campaign & { claimedCount: number; redeemedCount: number; availableCount: number }>> {
    const campaigns = await storage.getActiveCampaigns();
    
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const coupons = await storage.getCampaignCoupons(campaign.id);
        const claimedCount = coupons.length;
        const redeemedCount = coupons.filter(c => c.status === 'redeemed').length;
        
        return {
          ...campaign,
          claimedCount,
          redeemedCount,
          availableCount: campaign.maxCoupons - claimedCount,
        };
      })
    );
    
    return campaignsWithStats;
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    return await storage.getCampaign(id);
  }

  async validateCampaignForClaim(campaignId: number, userId: number): Promise<{ valid: boolean; error?: string }> {
    // Check if campaign exists
    const campaign = await storage.getCampaign(campaignId);
    if (!campaign) {
      return { valid: false, error: "Campaign not found" };
    }

    // Check if user already claimed this campaign
    const alreadyClaimed = await storage.hasUserClaimedCampaign(userId, campaignId);
    if (alreadyClaimed) {
      return { valid: false, error: "You have already claimed this coupon" };
    }

    // Check if campaign has available coupons
    const existingCoupons = await storage.getCampaignCoupons(campaignId);
    if (existingCoupons.length >= campaign.maxCoupons) {
      return { valid: false, error: "No more coupons available for this campaign" };
    }

    return { valid: true };
  }

  async getCampaignAnalytics() {
    const campaigns = await storage.getAllCampaigns();
    
    const analyticsData = await Promise.all(
      campaigns.map(async (campaign) => {
        const coupons = await storage.getCampaignCoupons(campaign.id);
        const stories = await storage.getCampaignStories(campaign.id);
        
        const claimsIssued = coupons.length;
        const couponsRedeemed = coupons.filter(c => c.status === 'redeemed').length;
        const storiesVerified = stories.length;
        const totalReach = stories.reduce((sum, story) => sum + (story.reach || 0), 0);
        
        return {
          campaign,
          stats: {
            claimsIssued,
            couponsRedeemed,
            storiesVerified,
            totalReach,
            redemptionRate: claimsIssued > 0 ? (couponsRedeemed / claimsIssued * 100).toFixed(1) : '0',
            shareRate: couponsRedeemed > 0 ? (storiesVerified / couponsRedeemed * 100).toFixed(1) : '0',
          },
        };
      })
    );
    
    return analyticsData;
  }
}

export const campaignBusiness = new CampaignBusiness();
