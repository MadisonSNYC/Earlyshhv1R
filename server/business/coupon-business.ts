
import { storage } from "../storage";
import type { Coupon, InsertCoupon } from "@shared/schema";

function generateStubCouponCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'STUB-';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateFetchCode(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += Math.floor(Math.random() * 10).toString();
    }
    segments.push(segment);
  }
  return segments.join('-');
}

export class CouponBusiness {
  async claimCouponForCampaign(campaignId: number, userId: number) {
    const campaign = await storage.getCampaign(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Generate coupon data
    const couponCode = generateStubCouponCode();
    const fetchCode = generateFetchCode();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month expiry

    const couponData: InsertCoupon = {
      campaignId,
      userId,
      code: couponCode,
      productName: campaign.productName,
      redeemableAmount: campaign.redeemableAmount,
      expirationDate,
      legalDisclaimer: "Terms apply. See details.",
      qrData: `https://earlyshh.com/coupon/${couponCode}`,
      fetchCode,
      redeemedAt: null,
      status: "claimed",
    };

    const coupon = await storage.createCoupon(couponData);
    
    return this.formatCouponResponse(coupon, campaign);
  }

  async getUserCouponsWithCampaigns(userId: number) {
    const coupons = await storage.getUserCoupons(userId);
    
    const enhancedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        const campaign = await storage.getCampaign(coupon.campaignId);
        return {
          ...coupon,
          campaign,
        };
      })
    );
    
    return enhancedCoupons;
  }

  async getCouponWithCampaign(couponId: number) {
    const coupon = await storage.getCoupon(couponId);
    if (!coupon) {
      return null;
    }

    const campaign = await storage.getCampaign(coupon.campaignId);
    
    return {
      ...coupon,
      campaign,
      brandName: campaign?.brandName || "Unknown Brand",
      productName: campaign?.productName || "Product",
      offerDescription: campaign?.offerDescription || "Special Offer"
    };
  }

  async redeemCoupon(couponId: number) {
    const updatedCoupon = await storage.updateCoupon(couponId, {
      status: "redeemed",
      redeemedAt: new Date(),
    });
    
    if (!updatedCoupon) {
      throw new Error("Coupon not found");
    }
    
    return updatedCoupon;
  }

  private formatCouponResponse(coupon: any, campaign: any) {
    return {
      id: coupon.id,
      couponId: coupon.id,
      campaignId: coupon.campaignId,
      code: coupon.code,
      qrData: coupon.qrData,
      fetchCode: coupon.fetchCode,
      productName: coupon.productName,
      brandName: campaign.brandName,
      brandLogo: campaign.brandLogoUrl,
      earlyshLogo: "https://earlyshh.com/logo-small.png",
      redeemableAmount: coupon.redeemableAmount,
      expirationDate: coupon.expirationDate.toISOString(),
      legalDisclaimer: coupon.legalDisclaimer,
      dateFetched: coupon.dateFetched.toISOString(),
      status: coupon.status,
    };
  }
}

export const couponBusiness = new CouponBusiness();
