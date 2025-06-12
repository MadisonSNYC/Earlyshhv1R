import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertNotificationSchema, insertFeedbackRequestSchema, insertProductFeedbackSchema, insertCampaignAccessLogSchema } from "@shared/schema";
import { z } from "zod";
import { storage } from "./storage";

// Business logic imports
import { campaignBusiness } from "./business/campaign-business";
import { couponBusiness } from "./business/coupon-business";
import { userBusiness } from "./business/user-business";
import { notificationBusiness } from "./business/notification-business";
import { storyBusiness } from "./business/story-business";
import { gamificationBusiness } from "./business/gamification-business";

// Middleware imports
import { validateBody, validateParams, validateQuery, idParamSchema, userIdQuerySchema } from "./middleware/validation-middleware";
import { errorHandler, asyncHandler, createApiError } from "./middleware/error-middleware";

// Request validation schemas
const instagramLoginSchema = z.object({
  instagramId: z.string(),
  username: z.string(),
  fullName: z.string(),
  profilePicUrl: z.string().optional(),
});

const claimCouponSchema = z.object({
  userId: z.number(),
});

const createStorySchema = z.object({
  userId: z.number(),
  campaignId: z.number(),
  couponId: z.number().optional(),
  instagramStoryId: z.string().optional(),
  impressions: z.number().optional(),
  reach: z.number().optional(),
});

const markNotificationReadSchema = z.object({
  userId: z.number(),
});

const markAllNotificationsReadSchema = z.object({
  userId: z.number(),
});

const updateUserProfileSchema = z.object({
  fullName: z.string().optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']).optional(),
  profilePicUrl: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/instagram", validateBody(instagramLoginSchema), asyncHandler(async (req: any, res: any) => {
    const user = await userBusiness.authenticateOrCreateUser(req.body);
    res.json({ user, message: "Login successful" });
  }));

  // Campaign routes
  app.get("/api/campaigns", asyncHandler(async (req: any, res: any) => {
    const campaigns = await campaignBusiness.getAllCampaignsWithStats();
    res.json(campaigns);
  }));

  app.get("/api/campaigns/:id", validateParams(idParamSchema), asyncHandler(async (req: any, res: any) => {
    const campaign = await campaignBusiness.getCampaignById(req.params.id);
    
    if (!campaign) {
      throw createApiError(404, "Campaign not found");
    }
    
    res.json(campaign);
  }));

  // Coupon routes
  app.post("/api/campaigns/:id/claim", 
    validateParams(idParamSchema), 
    validateBody(claimCouponSchema), 
    asyncHandler(async (req: any, res: any) => {
      const campaignId = req.params.id;
      const { userId } = req.body;

      // Validate campaign and user eligibility
      const validation = await campaignBusiness.validateCampaignForClaim(campaignId, userId);
      if (!validation.valid) {
        throw createApiError(400, validation.error!);
      }

      const couponResponse = await couponBusiness.claimCouponForCampaign(campaignId, userId);
      res.json(couponResponse);
    })
  );

  // Alternative endpoint for frontend compatibility
  app.post("/api/coupons/claim/:id", 
    validateParams(idParamSchema), 
    validateBody(claimCouponSchema), 
    asyncHandler(async (req: any, res: any) => {
      const campaignId = req.params.id;
      const { userId } = req.body;

      // Validate campaign and user eligibility
      const validation = await campaignBusiness.validateCampaignForClaim(campaignId, userId);
      if (!validation.valid) {
        throw createApiError(400, validation.error!);
      }

      const couponResponse = await couponBusiness.claimCouponForCampaign(campaignId, userId);
      res.json(couponResponse);
    })
  );

  app.get("/api/users/:userId/coupons", validateParams(z.object({ userId: z.string().transform(val => parseInt(val, 10)) })), asyncHandler(async (req: any, res: any) => {
    const coupons = await couponBusiness.getUserCouponsWithCampaigns(req.params.userId);
    res.json(coupons);
  }));

  app.get("/api/coupons/:id", validateParams(idParamSchema), asyncHandler(async (req: any, res: any) => {
    const coupon = await couponBusiness.getCouponWithCampaign(req.params.id);
    
    if (!coupon) {
      throw createApiError(404, "Coupon not found");
    }
    
    res.json(coupon);
  }));

  app.patch("/api/coupons/:id/redeem", validateParams(idParamSchema), asyncHandler(async (req: any, res: any) => {
    const updatedCoupon = await couponBusiness.redeemCoupon(req.params.id);
    res.json({ message: "Coupon redeemed successfully", coupon: updatedCoupon });
  }));

  // Story routes
  app.post("/api/stories", async (req, res) => {
    try {
      const data = createStorySchema.parse(req.body);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const story = await storage.createStory({
        userId,
        campaignId: data.campaignId,
        couponId: data.couponId || null,
        instagramStoryId: data.instagramStoryId || null,
        postedAt: new Date(),
        impressions: data.impressions || 0,
        reach: data.reach || 0,
        storyUrl: null,
        metadata: null,
      });

      res.json({ message: "Story created successfully", story });
    } catch (error) {
      res.status(500).json({ message: "Failed to create story", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/campaigns", async (req, res) => {
    try {
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
      
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // User stats
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const coupons = await storage.getUserCoupons(userId);
      const stories = await storage.getUserStories(userId);
      
      const stats = {
        claimed: coupons.length,
        redeemed: coupons.filter(c => c.status === 'redeemed').length,
        shared: stories.length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const notifications = await storage.getUserNotifications(parseInt(userId as string));
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/notifications/unread", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const unreadNotifications = await storage.getUnreadNotifications(parseInt(userId as string));
      res.json(unreadNotifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unread notifications", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/notifications/count", async (req, res) => {
    try {
      // Use hardcoded user ID 1 for MVP (same as other endpoints)
      const userId = 1;

      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification count", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const notification = await storage.getNotification(notificationId);
      if (!notification || notification.userId !== userId) {
        return res.status(404).json({ message: "Notification not found" });
      }

      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notifications as read", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const validatedData = insertNotificationSchema.parse({
        ...req.body,
        userId,
      });

      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to create notification", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Gamification routes
  app.get("/api/gamification/summary/:userId", validateParams(idParamSchema), asyncHandler(async (req: any, res: any) => {
    const userId = parseInt(req.params.userId);
    const summary = await gamificationBusiness.getUserGamificationSummary(userId);
    
    if (!summary) {
      throw createApiError(404, "User gamification data not found");
    }
    
    res.json(summary);
  }));

  app.get("/api/badges", asyncHandler(async (req: any, res: any) => {
    const badges = await storage.getAllBadges();
    res.json(badges);
  }));

  app.get("/api/users/:userId/badges", validateParams(idParamSchema), asyncHandler(async (req: any, res: any) => {
    const userId = parseInt(req.params.userId);
    const userBadges = await storage.getUserBadges(userId);
    res.json(userBadges);
  }));

  app.get("/api/users/:userId/activities", validateParams(idParamSchema), asyncHandler(async (req: any, res: any) => {
    const userId = parseInt(req.params.userId);
    const { limit } = req.query;
    
    if (limit) {
      const activities = await storage.getUserRecentActivities(userId, parseInt(limit as string));
      res.json(activities);
    } else {
      const activities = await storage.getUserActivities(userId);
      res.json(activities);
    }
  }));

  app.post("/api/gamification/track", asyncHandler(async (req: any, res: any) => {
    const { userId, activityType, metadata } = req.body;
    
    if (!userId || !activityType) {
      throw createApiError(400, "userId and activityType are required");
    }
    
    const activity = await gamificationBusiness.trackActivity(userId, activityType, metadata);
    res.status(201).json(activity);
  }));

  app.post("/api/gamification/initialize", asyncHandler(async (req: any, res: any) => {
    await gamificationBusiness.initializeBadges();
    res.json({ message: "Gamification system initialized successfully" });
  }));

  // User profile update
  app.patch("/api/users/:userId", 
    validateParams(idParamSchema), 
    validateBody(updateUserProfileSchema), 
    asyncHandler(async (req: any, res: any) => {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(userId, updates);
      
      if (!updatedUser) {
        throw createApiError(404, "User not found");
      }
      
      res.json(updatedUser);
    })
  );

  // Add error handling middleware
  app.use(errorHandler);

  const httpServer = createServer(app);
  return httpServer;
}
