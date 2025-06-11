
export interface User {
  id: string;
  instagramId: string;
  username: string;
  fullName: string;
  profilePicUrl?: string;
  ageVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface Campaign {
  id: string;
  brandName: string;
  brandIgHandle: string;
  offerDescription: string;
  productName: string;
  brandLogoUrl?: string;
  offerId?: string; // TCB Master Offer ID
  redeemableAmount: string;
  startDate: string;
  endDate: string;
  maxCoupons: number;
  perUserLimit: number;
  status: 'active' | 'inactive' | 'expired';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  distance?: number;
  claimed?: boolean;
  spotsRemaining?: number;
}

export interface Coupon {
  id: string;
  campaignId: string;
  userId: string;
  code: string;
  productName: string;
  brandName: string;
  brandLogo?: string;
  redeemableAmount: string;
  expirationDate: string;
  legalDisclaimer: string;
  qrData: string;
  fetchCode: string;
  dateFetched: string;
  claimedAt: string;
  redeemedAt?: string;
  status: 'claimed' | 'redeemed' | 'expired';
  offerDescription?: string;
}

export interface Story {
  id: string;
  userId: string;
  campaignId: string;
  instagramStoryId: string;
  postedAt: string;
  detectedAt: string;
  impressions?: number;
  reach?: number;
  storyUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'campaign_available' | 'coupon_expiring' | 'story_detected' | 'partnership_complete';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
  success: boolean;
}

export interface APIError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface MapViewProps {
  campaigns: Campaign[];
  userLocation: LocationData | null;
  onCampaignClick: (campaign: Campaign) => void;
  selectedCampaign?: Campaign | null;
}

export interface CouponDisplayProps {
  coupon: Coupon;
  onShare?: () => void;
  onShowTerms?: () => void;
}

// Instagram-related types
export interface InstagramUser {
  id: string;
  username: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export interface InstagramStoryInsight {
  impressions: number;
  reach: number;
  replies?: number;
  shares?: number;
}

// TCB Integration types (for Phase II)
export interface TCBOffer {
  offerId: string;
  offerDescription: string;
  brandName: string;
  productName: string;
  redeemableAmount: number;
  expirationDate: string;
  legalText: string;
}

export interface TCBCoupon {
  serialNumber: string;
  offerId: string;
  qrCode: string;
  fetchCode: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'redeemed' | 'expired';
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T = Record<string, any>> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
}
