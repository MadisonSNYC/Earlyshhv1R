import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

function generateStubCouponCode(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}

function generateFetchCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/campaigns/categories", async (req, res) => {
    try {
      // Return sample categories for partnership filtering
      const categories = [
        { id: 1, name: "Food & Beverage", icon: "🍽️" },
        { id: 2, name: "Beauty & Wellness", icon: "💄" },
        { id: 3, name: "Fitness & Health", icon: "💪" },
        { id: 4, name: "Fashion & Style", icon: "👗" },
        { id: 5, name: "Tech & Gadgets", icon: "📱" },
        { id: 6, name: "Home & Living", icon: "🏠" }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      // Return hardcoded user for MVP
      const user = await storage.getUser(1);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/user/stats", async (req, res) => {
    try {
      const userId = 1; // Hardcoded for MVP
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

  // User coupons/partnerships routes
  app.get("/api/users/:userId/coupons", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId) || 1;
      const coupons = await storage.getUserCoupons(userId);
      
      // Enhance coupons with campaign data
      const enhancedCoupons = await Promise.all(
        coupons.map(async (coupon) => {
          const campaign = await storage.getCampaign(coupon.campaignId);
          return {
            ...coupon,
            campaign: campaign
          };
        })
      );
      
      res.json(enhancedCoupons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user coupons", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/notifications/count", async (req, res) => {
    try {
      const userId = 1; // Hardcoded for MVP
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification count", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Coupon claiming
  app.post("/api/campaigns/:id/claim", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const userId = 1; // Hardcoded for MVP
      
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      const hasAlreadyClaimed = await storage.hasUserClaimedCampaign(userId, campaignId);
      if (hasAlreadyClaimed) {
        return res.status(400).json({ message: "You have already claimed this coupon" });
      }

      const coupon = await storage.createCoupon({
        campaignId,
        userId,
        code: generateStubCouponCode(),
        status: "claimed",
        productName: campaign.productName,
        redeemableAmount: campaign.redeemableAmount,
        expirationDate: campaign.endDate,
        legalDisclaimer: "Terms and conditions apply. See store for details.",
        qrData: `coupon-${campaignId}-${userId}`,
        fetchCode: generateFetchCode(),
        redeemedAt: null,
      });

      res.status(201).json(coupon);
    } catch (error) {
      res.status(500).json({ message: "Failed to claim coupon", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Placeholder images
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const color = req.query.color || "cccccc";
    const text = req.query.text || `${width}x${height}`;
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#666">${text}</text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  const httpServer = createServer(app);
  return httpServer;
}