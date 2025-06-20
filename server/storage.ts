import { users, campaigns, coupons, stories, analytics, notifications, badges, userBadges, userActivities, userStats, feedbackRequests, productFeedback, campaignAccessLog, type User, type InsertUser, type Campaign, type InsertCampaign, type Coupon, type InsertCoupon, type Story, type InsertStory, type Analytics, type InsertAnalytics, type Notification, type InsertNotification, type Badge, type InsertBadge, type UserBadge, type InsertUserBadge, type UserActivity, type InsertUserActivity, type UserStats, type InsertUserStats, type FeedbackRequest, type InsertFeedbackRequest, type ProductFeedback, type InsertProductFeedback, type CampaignAccessLog, type InsertCampaignAccessLog } from "@shared/schema";

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

  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  getUnreadNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  getUnreadNotificationCount(userId: number): Promise<number>;

  // Gamification operations
  getBadge(id: string): Promise<Badge | undefined>;
  getAllBadges(): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  getUserBadges(userId: number): Promise<UserBadge[]>;
  createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  getUserActivities(userId: number): Promise<UserActivity[]>;
  getUserRecentActivities(userId: number, limit: number): Promise<UserActivity[]>;
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  
  getUserStats(userId: number): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats | undefined>;
  
  getUserStoriesInTimeframe(userId: number, timeframe: string): Promise<number>;

  // Feedback gating operations
  getFeedbackRequest(id: number): Promise<FeedbackRequest | undefined>;
  getUserPendingFeedback(userId: number): Promise<FeedbackRequest[]>;
  createFeedbackRequest(request: InsertFeedbackRequest): Promise<FeedbackRequest>;
  updateFeedbackRequest(id: number, updates: Partial<FeedbackRequest>): Promise<FeedbackRequest | undefined>;
  
  getProductFeedback(id: number): Promise<ProductFeedback | undefined>;
  getFeedbackByRequest(requestId: number): Promise<ProductFeedback | undefined>;
  createProductFeedback(feedback: InsertProductFeedback): Promise<ProductFeedback>;
  
  logCampaignAccess(log: InsertCampaignAccessLog): Promise<CampaignAccessLog>;
  canUserAccessCampaign(userId: number, campaignId: number): Promise<{ canAccess: boolean; reason?: string; pendingCount?: number }>;
  
  // Favorite operations - commented out for now as not implemented
  // getFavorite(id: number): Promise<Favorite | undefined>;
  // getUserFavorites(userId: number): Promise<Favorite[]>;
  // createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  // deleteFavorite(id: number): Promise<void>;
  // isUserFavoriteCampaign(userId: number, campaignId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private campaigns: Map<number, Campaign> = new Map();
  private coupons: Map<number, Coupon> = new Map();
  private stories: Map<number, Story> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private notifications: Map<number, Notification> = new Map();
  private badges: Map<string, Badge> = new Map();
  private userBadges: Map<number, UserBadge> = new Map();
  private userActivities: Map<number, UserActivity> = new Map();
  private userStats: Map<number, UserStats> = new Map();
  private feedbackRequests: Map<number, FeedbackRequest> = new Map();
  private productFeedback: Map<number, ProductFeedback> = new Map();
  private campaignAccessLogs: Map<number, CampaignAccessLog> = new Map();
  private currentUserId = 1;
  private currentCampaignId = 1;
  private currentCouponId = 1;
  private currentStoryId = 1;
  private currentAnalyticsId = 1;
  private currentNotificationId = 1;
  private currentUserBadgeId = 1;
  private currentUserActivityId = 1;
  private currentFeedbackRequestId = 1;
  private currentProductFeedbackId = 1;
  private currentCampaignAccessLogId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample user with gamification fields
    const sampleUser: User = {
      id: this.currentUserId++,
      instagramId: "sample_user_123",
      username: "college.explorer",
      fullName: "Alex Johnson",
      profilePicUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      gender: "prefer-not-to-say",
      ageVerified: true,
      accessToken: null,
      createdAt: new Date("2024-01-01"),
      lastLogin: new Date(),
      totalFreeProducts: 3,
      totalSavings: "47.97",
      currentStreak: 2,
      longestStreak: 5,
      lastActivityDate: new Date(),
      level: "Explorer",
      badges: ["first_timer", "streak_starter"]
    };
    
    this.users.set(sampleUser.id, sampleUser);

    // Create sample campaigns located around 120 Bedford Ave, Williamsburg
    const sampleCampaigns: Campaign[] = [
      {
        id: this.currentCampaignId++,
        brandName: "SUPEROOT",
        brandIgHandle: "@drinksuperoot",
        brandBio: "SUPEROOT is a dry powder electrolyte mix with ingredients that studies show can boost immunity, hydrate, detox, enhance mental clarity, improve physical stamina, and support long-term vitality.\n\nIt blends a perfectly balanced 3-mineral electrolyte formula (potassium, magnesium, sodium) with the all-natural powder of 6 different roots—ginger, turmeric, beet, maca, carrot, and ginseng—and then a healthy helping of vitamin C to form a drink to support your immune system every day.\n\nWhether you're a college student powering through late-night study sessions, a fitness enthusiast crushing your morning workout, or a busy professional navigating a demanding schedule, SUPEROOT provides the clean, natural boost you need to perform at your best.\n\nJoin thousands of satisfied customers who have made SUPEROOT their go-to electrolyte solution. Experience the difference that premium, natural ingredients can make in your daily performance and overall well-being.",
        offerDescription: "Free Sample Electrolyte Mix",
        productName: "SUPEROOT Daily Electrolyte Mix",
        brandLogoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "3.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 200,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7139", // Near 120 Bedford Ave, Williamsburg
        longitude: "-73.9584",
        radius: "0.3",
        category: "food",
        legalDisclaimer: "Offer valid for new customers only. One per person.",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: this.currentCampaignId++,
        brandName: "Williamsburg Coffee Co",
        brandIgHandle: "@williamsburgcoffee",
        brandBio: "Williamsburg Coffee Co is a local artisan coffee roastery serving the creative community of Brooklyn. We source ethically-traded beans and roast them fresh daily in our Bedford Avenue location.",
        offerDescription: "Free Cold Brew Sample",
        productName: "Brooklyn Blend Cold Brew",
        brandLogoUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "4.50",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 100,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7142", // 124 Bedford Ave area
        longitude: "-73.9580",
        radius: "0.2",
        category: "food",
        legalDisclaimer: "Valid at Bedford Avenue location only.",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: this.currentCampaignId++,
        brandName: "Brooklyn Beauty Lab",
        brandIgHandle: "@brooklynbeautylab",
        brandBio: "Brooklyn Beauty Lab creates artisan skincare products in small batches using locally-sourced ingredients. Our Williamsburg studio focuses on sustainable beauty solutions for urban dwellers.",
        offerDescription: "Mini Facial Kit Sample",
        productName: "Urban Glow Essentials Kit",
        brandLogoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "12.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 75,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7135", // Grand Street area
        longitude: "-73.9578",
        radius: "0.4",
        category: "beauty",
        legalDisclaimer: "Sample kit contains travel-size products.",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: this.currentCampaignId++,
        brandName: "Greenpoint Wellness",
        brandIgHandle: "@greenpointwellness",
        brandBio: "Greenpoint Wellness brings holistic health solutions to North Brooklyn. Our adaptogenic supplements and wellness products support the busy lifestyle of creative professionals.",
        offerDescription: "Stress Relief Supplement Sample",
        productName: "Brooklyn Calm Adaptogenic Blend",
        brandLogoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "15.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 60,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7148", // McCarren Park area
        longitude: "-73.9588",
        radius: "0.5",
        category: "wellness",
        legalDisclaimer: "Consult your healthcare provider before use.",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: this.currentCampaignId++,
        brandName: "East River Fitness",
        brandIgHandle: "@eastriverfitness",
        brandBio: "East River Fitness is Williamsburg's premier boutique fitness studio offering personalized training and group classes with views of Manhattan skyline.",
        offerDescription: "Free Personal Training Session",
        productName: "One-on-One Fitness Assessment",
        brandLogoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "75.00",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 40,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7131", // East River area
        longitude: "-73.9567",
        radius: "0.6",
        category: "fitness",
        legalDisclaimer: "Must be 18+ and complete health screening.",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: this.currentCampaignId++,
        brandName: "Artisan Candle Co",
        brandIgHandle: "@artisancandleco",
        brandBio: "Artisan Candle Co hand-pours premium soy candles in our Williamsburg workshop. Each candle is crafted with natural fragrances inspired by Brooklyn neighborhoods.",
        offerDescription: "Signature Scent Candle",
        productName: "Williamsburg Breeze Candle",
        brandLogoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "22.00",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 50,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7144", // Metropolitan Ave area
        longitude: "-73.9592",
        radius: "0.3",
        category: "lifestyle",
        legalDisclaimer: "Pickup available at studio location only.",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: this.currentCampaignId++,
        brandName: "Urban Threads",
        brandIgHandle: "@urbanthreads",
        brandBio: "Urban Threads is a contemporary fashion brand creating affordable, trendy accessories and clothing for the modern college lifestyle. We believe style shouldn't break the bank.",
        offerDescription: "Designer T-Shirt Sample",
        productName: "Organic Cotton Premium Tee",
        brandLogoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "15.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 75,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7282",
        longitude: "-73.7949",
        radius: "1.5",
        category: "fashion",
      },
      {
        id: this.currentCampaignId++,
        brandName: "FitTech Innovations",
        brandIgHandle: "@fittechinno",
        brandBio: "FitTech Innovations develops cutting-edge wearable technology to help students track their health and fitness goals. Our smart devices combine style with functionality for the active campus lifestyle.",
        offerDescription: "Smart Fitness Tracker Trial",
        productName: "FitPro Wellness Band",
        brandLogoUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "29.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 30,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7614",
        longitude: "-73.9776",
        radius: "3.0",
        category: "tech",
      },
      {
        id: this.currentCampaignId++,
        brandName: "Green Earth Supplements",
        brandIgHandle: "@greenearthsupps",
        brandBio: "Green Earth Supplements creates premium, plant-based nutrition products for health-conscious students. Our organic supplements support active lifestyles with clean, sustainable ingredients.",
        offerDescription: "Organic Protein Sample Pack",
        productName: "Plant-Based Protein Blend",
        brandLogoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "12.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 150,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7411",
        longitude: "-74.0024",
        radius: "2.5",
        category: "health",
      },
      {
        id: this.currentCampaignId++,
        brandName: "Artisan Bakery Co",
        brandIgHandle: "@artisanbakeryco",
        brandBio: "Artisan Bakery Co crafts traditional, handmade breads using time-honored techniques and locally sourced ingredients. Our fresh baked goods bring authentic flavors to busy campus life.",
        offerDescription: "Fresh Sourdough Loaf",
        productName: "Traditional Sourdough Bread",
        brandLogoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop",
        offerId: null,
        redeemableAmount: "6.99",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-12-31"),
        maxCoupons: 80,
        perUserLimit: 1,
        status: "active",
        latitude: "40.7357",
        longitude: "-73.9910",
        radius: "1.0",
        category: "food",
      },
    ];

    sampleCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });

    // Create sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: this.currentNotificationId++,
        userId: 1,
        type: "new_deal",
        title: "New Deal Alert!",
        message: "SuperRoot Energy just dropped a free sample offer near you",
        icon: "gift",
        actionUrl: "/",
        isRead: false,
        priority: "high",
        metadata: { campaignId: 1 },
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        readAt: null,
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        type: "achievement",
        title: "First Coupon Claimed!",
        message: "You've claimed your first early access deal. Keep exploring!",
        icon: "trophy",
        actionUrl: "/my-coupons",
        isRead: false,
        priority: "normal",
        metadata: { achievement: "first_claim" },
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        readAt: null,
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        type: "redemption_confirmed",
        title: "Deal Redeemed Successfully!",
        message: "Your SuperRoot Energy coupon was redeemed at Brooklyn Store",
        icon: "check-circle",
        actionUrl: "/my-coupons",
        isRead: true,
        priority: "normal",
        metadata: { couponId: 1, location: "Brooklyn Store" },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        readAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        type: "deal_expiring",
        title: "Deal Expires Soon",
        message: "Your Glow Beauty face mask coupon expires in 2 hours",
        icon: "clock",
        actionUrl: "/redeem/2",
        isRead: false,
        priority: "high",
        metadata: { couponId: 2, expiresIn: "2 hours" },
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        readAt: null,
      },
      {
        id: this.currentNotificationId++,
        userId: 1,
        type: "story_verified",
        title: "Story Verified!",
        message: "Your Instagram story was verified. Bonus points earned!",
        icon: "instagram",
        actionUrl: "/profile",
        isRead: true,
        priority: "normal",
        metadata: { storyId: 1, bonusPoints: 50 },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        readAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
      },
    ];

    sampleNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
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
      gender: insertUser.gender || null,
      ageVerified: insertUser.ageVerified || false,
      accessToken: insertUser.accessToken || null,
      totalFreeProducts: insertUser.totalFreeProducts || 0,
      totalSavings: insertUser.totalSavings || "0.00",
      currentStreak: insertUser.currentStreak || 0,
      longestStreak: insertUser.longestStreak || 0,
      lastActivityDate: insertUser.lastActivityDate || null,
      level: insertUser.level || "Newbie",
      badges: insertUser.badges || [],
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

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const notification: Notification = {
      id: this.currentNotificationId++,
      userId: insertNotification.userId,
      type: insertNotification.type,
      title: insertNotification.title,
      message: insertNotification.message,
      icon: insertNotification.icon,
      actionUrl: insertNotification.actionUrl || null,
      isRead: insertNotification.isRead || false,
      priority: insertNotification.priority || "normal",
      metadata: insertNotification.metadata || null,
      createdAt: new Date(),
      readAt: null,
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (notification) {
      const updatedNotification = { ...notification, isRead: true, readAt: new Date() };
      this.notifications.set(id, updatedNotification);
      return updatedNotification;
    }
    return undefined;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    Array.from(this.notifications.entries()).forEach(([id, notification]) => {
      if (notification.userId === userId && !notification.isRead) {
        this.notifications.set(id, { ...notification, isRead: true, readAt: new Date() });
      }
    });
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead).length;
  }

  // Gamification methods
  async getBadge(id: string): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const badge: Badge = {
      ...insertBadge,
      isActive: insertBadge.isActive ?? true,
      createdAt: new Date()
    };
    this.badges.set(badge.id, badge);
    return badge;
  }

  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values())
      .filter(userBadge => userBadge.userId === userId);
  }

  async createUserBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const userBadge: UserBadge = {
      id: this.currentUserBadgeId++,
      ...insertUserBadge,
      progress: insertUserBadge.progress || null,
      earnedAt: new Date()
    };
    this.userBadges.set(userBadge.id, userBadge);
    return userBadge;
  }

  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserRecentActivities(userId: number, limit: number): Promise<UserActivity[]> {
    const activities = await this.getUserActivities(userId);
    return activities.slice(0, limit);
  }

  async createUserActivity(insertActivity: InsertUserActivity): Promise<UserActivity> {
    const activity: UserActivity = {
      id: this.currentUserActivityId++,
      ...insertActivity,
      points: insertActivity.points ?? 0,
      createdAt: new Date()
    };
    this.userActivities.set(activity.id, activity);
    return activity;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const stats: UserStats = {
      id: insertStats.userId,
      ...insertStats,
      totalSavings: insertStats.totalSavings ?? "0.00",
      currentStreak: insertStats.currentStreak ?? 0,
      longestStreak: insertStats.longestStreak ?? 0,
      level: insertStats.level ?? "Newbie",
      totalProducts: insertStats.totalProducts ?? 0,
      totalPoints: insertStats.totalPoints ?? 0,
      storiesPosted: insertStats.storiesPosted ?? 0,
      friendsReferred: insertStats.friendsReferred ?? 0,
      lastActivityDate: insertStats.lastActivityDate ?? null,
      updatedAt: new Date()
    };
    this.userStats.set(insertStats.userId, stats);
    return stats;
  }

  async updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats | undefined> {
    const existingStats = this.userStats.get(userId);
    if (!existingStats) return undefined;

    const updatedStats = { 
      ...existingStats, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.userStats.set(userId, updatedStats);
    return updatedStats;
  }

  async getUserStoriesInTimeframe(userId: number, timeframe: string): Promise<number> {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        return 0;
    }

    return Array.from(this.stories.values())
      .filter(story => 
        story.userId === userId && 
        story.createdAt >= startDate
      ).length;
  }

  // Feedback gating operations
  async getFeedbackRequest(id: number): Promise<FeedbackRequest | undefined> {
    return this.feedbackRequests.get(id);
  }

  async getUserPendingFeedback(userId: number): Promise<FeedbackRequest[]> {
    return Array.from(this.feedbackRequests.values())
      .filter(request => request.userId === userId && request.status === 'pending');
  }

  async createFeedbackRequest(insertRequest: InsertFeedbackRequest): Promise<FeedbackRequest> {
    const request: FeedbackRequest = {
      ...insertRequest,
      id: this.currentFeedbackRequestId++,
      status: insertRequest.status || 'pending',
      remindersSent: insertRequest.remindersSent || 0,
      createdAt: new Date(),
      completedAt: null,
      bypassReason: null,
    };
    this.feedbackRequests.set(request.id, request);
    return request;
  }

  async updateFeedbackRequest(id: number, updates: Partial<FeedbackRequest>): Promise<FeedbackRequest | undefined> {
    const request = this.feedbackRequests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, ...updates };
    this.feedbackRequests.set(id, updated);
    return updated;
  }

  async getProductFeedback(id: number): Promise<ProductFeedback | undefined> {
    return this.productFeedback.get(id);
  }

  async getFeedbackByRequest(requestId: number): Promise<ProductFeedback | undefined> {
    return Array.from(this.productFeedback.values())
      .find(feedback => feedback.feedbackRequestId === requestId);
  }

  async createProductFeedback(insertFeedback: InsertProductFeedback): Promise<ProductFeedback> {
    const feedback: ProductFeedback = {
      ...insertFeedback,
      id: this.currentProductFeedbackId++,
      experience: insertFeedback.experience || null,
      improvements: insertFeedback.improvements || null,
      productQuality: insertFeedback.productQuality || null,
      packaging: insertFeedback.packaging || null,
      value: insertFeedback.value || null,
      brandHelpfulness: insertFeedback.brandHelpfulness || null,
      createdAt: new Date(),
    };
    this.productFeedback.set(feedback.id, feedback);
    
    // Mark the feedback request as completed
    await this.updateFeedbackRequest(feedback.feedbackRequestId, {
      status: 'completed',
      completedAt: new Date(),
    });
    
    return feedback;
  }

  async logCampaignAccess(insertLog: InsertCampaignAccessLog): Promise<CampaignAccessLog> {
    const log: CampaignAccessLog = {
      ...insertLog,
      id: this.currentCampaignAccessLogId++,
      blocked: insertLog.blocked || false,
      blockReason: insertLog.blockReason || null,
      pendingFeedbackCount: insertLog.pendingFeedbackCount || null,
      accessAttemptedAt: new Date(),
    };
    this.campaignAccessLogs.set(log.id, log);
    return log;
  }

  async canUserAccessCampaign(userId: number, campaignId: number): Promise<{ canAccess: boolean; reason?: string; pendingCount?: number }> {
    // Get all pending feedback requests for the user
    const pendingFeedback = await this.getUserPendingFeedback(userId);
    
    // Check if any feedback is overdue
    const now = new Date();
    const overdueFeedback = pendingFeedback.filter(request => request.deadline < now);
    
    if (overdueFeedback.length > 0) {
      return {
        canAccess: false,
        reason: 'overdue_feedback',
        pendingCount: overdueFeedback.length,
      };
    }
    
    if (pendingFeedback.length > 0) {
      return {
        canAccess: false,
        reason: 'pending_feedback',
        pendingCount: pendingFeedback.length,
      };
    }
    
    return { canAccess: true };
  }
}

export const storage = new MemStorage();
