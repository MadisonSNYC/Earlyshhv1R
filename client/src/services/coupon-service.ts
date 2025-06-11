
import { apiClient } from '@/lib/api-client';

export interface Coupon {
  id: number;
  campaignId: number;
  userId: number;
  code: string;
  productName: string;
  redeemableAmount: string;
  expirationDate: string;
  legalDisclaimer: string;
  qrData: string;
  fetchCode: string;
  redeemedAt: string | null;
  status: 'claimed' | 'redeemed' | 'expired';
  dateFetched: string;
  claimedAt: string;
  campaign?: any;
}

export class CouponService {
  async getUserCoupons(): Promise<Coupon[]> {
    try {
      const response = await apiClient.getUserCoupons();
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user coupons: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCouponById(id: number): Promise<Coupon> {
    try {
      const response = await apiClient.getCoupon(id);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch coupon ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async redeemCoupon(id: number) {
    try {
      const response = await apiClient.redeemCoupon(id);
      return response;
    } catch (error) {
      throw new Error(`Failed to redeem coupon ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateCouponCode(code: string): boolean {
    // Basic validation for coupon code format
    const codePattern = /^[A-Z0-9-]{8,}$/;
    return codePattern.test(code);
  }

  isCouponExpired(expirationDate: string): boolean {
    return new Date(expirationDate) < new Date();
  }

  getCouponTimeRemaining(expirationDate: string): string {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}

export const couponService = new CouponService();
