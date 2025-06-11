import { users, campaigns, coupons, stories, analytics, type User, type InsertUser, type Campaign, type InsertCampaign, type Coupon, type InsertCoupon, type Story, type InsertStory, type Analytics, type InsertAnalytics } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByInstagramId(instagramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;
  getActiveCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;

  // Coupon operations
  getCoupon(id: number): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  getUserCoupons(userId: number): Promise<Coupon[]>;
  getCampaignCoupons(campaignId: number): Promise<Coupon[]>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon | undefined>;
  hasUserClaimedCampaign(userId: number, campaignId: number): Promise<boolean>;

  // Story operations
  getStory(id: number): Promise<Story | undefined>;
  getUserStories(userId: number): Promise<Story[]>;
  getCampaignStories(campaignId: number): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;

  // Analytics operations
  getCampaignAnalytics(campaignId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(campaignId: number, updates: Partial<Analytics>): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private campaigns: Map<number, Campaign> = new Map();
  private coupons: Map<number, Coupon> = new Map();
  private stories: Map<number, Story> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private currentUserId = 1;
  private currentCampaignId = 1;
  private currentCouponId = 1;
  private currentStoryId = 1;
  private currentAnalyticsId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample campaigns
    const sampleCampaigns: Campaign[] = [
      {
        id: this.currentCampaignId++,
        brandName: "SuperRoot Energy",
        brandIgHandle: "@superrootenergy",
        offerDescription: "Free Sample Energy Drink",
        productName: "SuperRoot Premium Energy Formula",
        brandLogoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "3.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 200,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7128",
        longitude: "-74.0060",
        radius: "1.0",
        category: "food",
      },
      {
        id: this.currentCampaignId++,
        brandName: "Brew Coffee Co",
        brandIgHandle: "@brewcoffeeco",
        offerDescription: "Premium Coffee Sample",
        productName: "Single Origin Ethiopian Blend",
        brandLogoUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "4.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 50,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7589",
        longitude: "-73.9851",
        radius: "0.5",
        category: "food",
      },
      {
        id: this.currentCampaignId++,
        brandName: "Pure Glow Skincare",
        brandIgHandle: "@pureglowskincare",
        offerDescription: "Hydrating Face Mask",
        productName: "Premium Collagen Formula",
        brandLogoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "8.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 100,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7505",
        longitude: "-73.9934",
        radius: "2.0",
        category: "premium",
      },
    ];

    sampleCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByInstagramId(instagramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.instagramId === instagramId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      profilePicUrl: insertUser.profilePicUrl || null,
      ageVerified: insertUser.ageVerified || false,
      accessToken: insertUser.accessToken || null,
      createdAt: new Date(),
      lastLogin: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => 
      campaign.status === "active" && 
      new Date() >= campaign.startDate && 
      new Date() <= campaign.endDate
    );
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const campaign: Campaign = {
      ...insertCampaign,
      id: this.currentCampaignId++,
      offerId: insertCampaign.offerId || null,
      status: insertCampaign.status || "active",
      category: insertCampaign.category || "general",
      radius: insertCampaign.radius || "1.0",
      latitude: insertCampaign.latitude || null,
      longitude: insertCampaign.longitude || null,
      perUserLimit: insertCampaign.perUserLimit || 1,
    };
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Coupon operations
  async getCoupon(id: number): Promise<Coupon | undefined> {
    return this.coupons.get(id);
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.coupons.values()).find(coupon => coupon.code === code);
  }

  async getUserCoupons(userId: number): Promise<Coupon[]> {
    return Array.from(this.coupons.values()).filter(coupon => coupon.userId === userId);
  }

  async getCampaignCoupons(campaignId: number): Promise<Coupon[]> {
    return Array.from(this.coupons.values()).filter(coupon => coupon.campaignId === campaignId);
  }

  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const coupon: Coupon = {
      ...insertCoupon,
      id: this.currentCouponId++,
      status: insertCoupon.status || "claimed",
      redeemedAt: insertCoupon.redeemedAt || null,
      dateFetched: new Date(),
      claimedAt: new Date(),
    };
    this.coupons.set(coupon.id, coupon);
    return coupon;
  }

  async updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon | undefined> {
    const coupon = this.coupons.get(id);
    if (!coupon) return undefined;
    
    const updatedCoupon = { ...coupon, ...updates };
    this.coupons.set(id, updatedCoupon);
    return updatedCoupon;
  }

  async hasUserClaimedCampaign(userId: number, campaignId: number): Promise<boolean> {
    return Array.from(this.coupons.values()).some(
      coupon => coupon.userId === userId && coupon.campaignId === campaignId
    );
  }

  // Story operations
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getUserStories(userId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.userId === userId);
  }

  async getCampaignStories(campaignId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.campaignId === campaignId);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const story: Story = {
      ...insertStory,
      id: this.currentStoryId++,
      couponId: insertStory.couponId || null,
      instagramStoryId: insertStory.instagramStoryId || null,
      impressions: insertStory.impressions || 0,
      reach: insertStory.reach || 0,
      storyUrl: insertStory.storyUrl || null,
      metadata: insertStory.metadata || null,
      detectedAt: new Date(),
    };
    this.stories.set(story.id, story);
    return story;
  }

  // Analytics operations
  async getCampaignAnalytics(campaignId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.campaignId === campaignId);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const analytics: Analytics = {
      ...insertAnalytics,
      id: this.currentAnalyticsId++,
      claimsIssued: insertAnalytics.claimsIssued || 0,
      couponsRedeemed: insertAnalytics.couponsRedeemed || 0,
      storiesVerified: insertAnalytics.storiesVerified || 0,
      totalReach: insertAnalytics.totalReach || 0,
      metadata: insertAnalytics.metadata || null,
      date: new Date(),
    };
    this.analytics.set(analytics.id, analytics);
    return analytics;
  }

  async updateAnalytics(campaignId: number, updates: Partial<Analytics>): Promise<void> {
    // For now, just create new analytics entry
    await this.createAnalytics({
      campaignId,
      claimsIssued: updates.claimsIssued || 0,
      couponsRedeemed: updates.couponsRedeemed || 0,
      storiesVerified: updates.storiesVerified || 0,
      totalReach: updates.totalReach || 0,
      metadata: updates.metadata || null,
    });
  }
}

export const storage = new MemStorage();
