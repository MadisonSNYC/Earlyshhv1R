import { users, campaigns, coupons, stories, analytics, notifications, badges, userBadges, userActivities, userStats, type User, type InsertUser, type Campaign, type InsertCampaign, type Coupon, type InsertCoupon, type Story, type InsertStory, type Analytics, type InsertAnalytics, type Notification, type InsertNotification, type Badge, type InsertBadge, type UserBadge, type InsertUserBadge, type UserActivity, type InsertUserActivity, type UserStats, type InsertUserStats } from "@shared/schema";

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
  private currentUserId = 1;
  private currentCampaignId = 1;
  private currentCouponId = 1;
  private currentStoryId = 1;
  private currentAnalyticsId = 1;
  private currentNotificationId = 1;
  private currentUserBadgeId = 1;
  private currentUserActivityId = 1;

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
        category: "beauty",
      },
      {
        id: this.currentCampaignId++,
        brandName: "Urban Threads",
        brandIgHandle: "@urbanthreads",
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
}

export const storage = new MemStorage();
