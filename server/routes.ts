import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCouponSchema, insertStorySchema, insertNotificationSchema } from "@shared/schema";
import { z } from "zod";

// Instagram OAuth simulation for MVP
const instagramLoginSchema = z.object({
  instagramId: z.string(),
  username: z.string(),
  fullName: z.string(),
  profilePicUrl: z.string().optional(),
});

// Coupon claim schema
const claimCouponSchema = z.object({
  campaignId: z.number(),
});

// Story creation schema
const createStorySchema = z.object({
  campaignId: z.number(),
  couponId: z.number().optional(),
  instagramStoryId: z.string().optional(),
  impressions: z.number().optional(),
  reach: z.number().optional(),
});

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/instagram", async (req, res) => {
    try {
      const data = instagramLoginSchema.parse(req.body);
      
      // Check if user already exists
      let user = await storage.getUserByInstagramId(data.instagramId);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          instagramId: data.instagramId,
          username: data.username,
          fullName: data.fullName,
          profilePicUrl: data.profilePicUrl || null,
          ageVerified: true, // Assume verified for MVP
          accessToken: null,
        });
      } else {
        // Update last login
        user = await storage.updateUser(user.id, { lastLogin: new Date() });
      }

      res.json({ user, message: "Login successful" });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getActiveCampaigns();
      
      // Add claim counts for each campaign
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
      
      res.json(campaignsWithStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Coupon routes
  app.post("/api/campaigns/:id/claim", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      // Check if campaign exists
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Check if user already claimed this campaign
      const alreadyClaimed = await storage.hasUserClaimedCampaign(userId, campaignId);
      if (alreadyClaimed) {
        return res.status(400).json({ message: "You have already claimed this coupon" });
      }

      // Check if campaign has available coupons
      const existingCoupons = await storage.getCampaignCoupons(campaignId);
      if (existingCoupons.length >= campaign.maxCoupons) {
        return res.status(400).json({ message: "No more coupons available for this campaign" });
      }

      // Generate stub coupon
      const couponCode = generateStubCouponCode();
      const fetchCode = generateFetchCode();
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month expiry

      const coupon = await storage.createCoupon({
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
      });

      // Return enhanced coupon response
      res.json({
        couponId: coupon.id,
        campaignId: coupon.campaignId,
        code: coupon.code,
        qrData: coupon.qrData,
        fetchCode: coupon.fetchCode,
        productName: coupon.productName,
        brandLogo: campaign.brandLogoUrl,
        earlyshLogo: "https://earlyshh.com/logo-small.png",
        redeemableAmount: `$${coupon.redeemableAmount}`,
        expirationDate: coupon.expirationDate.toISOString(),
        legalDisclaimer: coupon.legalDisclaimer,
        dateFetched: coupon.dateFetched.toISOString(),
        status: coupon.status,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to claim coupon", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/users/:userId/coupons", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const coupons = await storage.getUserCoupons(userId);
      
      // Enhance coupons with campaign data
      const enhancedCoupons = await Promise.all(
        coupons.map(async (coupon) => {
          const campaign = await storage.getCampaign(coupon.campaignId);
          return {
            ...coupon,
            campaign,
          };
        })
      );
      
      res.json(enhancedCoupons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user coupons", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/coupons/:id", async (req, res) => {
    try {
      const couponId = parseInt(req.params.id);
      const coupon = await storage.getCoupon(couponId);
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      const campaign = await storage.getCampaign(coupon.campaignId);
      
      res.json({
        ...coupon,
        campaign,
        brandName: campaign?.brandName || "Unknown Brand",
        productName: campaign?.productName || "Product",
        offerDescription: campaign?.offerDescription || "Special Offer"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupon", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/coupons/:id/redeem", async (req, res) => {
    try {
      const couponId = parseInt(req.params.id);
      
      const updatedCoupon = await storage.updateCoupon(couponId, {
        status: "redeemed",
        redeemedAt: new Date(),
      });
      
      if (!updatedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      res.json({ message: "Coupon redeemed successfully", coupon: updatedCoupon });
    } catch (error) {
      res.status(500).json({ message: "Failed to redeem coupon", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/notifications/unread", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const unreadNotifications = await storage.getUnreadNotifications(userId);
      res.json(unreadNotifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unread notifications", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/notifications/count", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification count", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notifications as read", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
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

  const httpServer = createServer(app);
  return httpServer;
}
