
import { storage } from "../storage";
import type { User, InsertUser } from "@shared/schema";

export class UserBusiness {
  async authenticateOrCreateUser(data: {
    instagramId: string;
    username: string;
    fullName: string;
    profilePicUrl?: string;
  }): Promise<User> {
    // Check if user already exists
    let user = await storage.getUserByInstagramId(data.instagramId);
    
    if (!user) {
      // Create new user
      const userData: InsertUser = {
        instagramId: data.instagramId,
        username: data.username,
        fullName: data.fullName,
        profilePicUrl: data.profilePicUrl || null,
        ageVerified: true, // Assume verified for MVP
        accessToken: null,
      };
      user = await storage.createUser(userData);
    } else {
      // Update last login
      user = await storage.updateUser(user.id, { lastLogin: new Date() });
    }

    return user;
  }

  async getUserStats(userId: number) {
    const coupons = await storage.getUserCoupons(userId);
    const stories = await storage.getUserStories(userId);
    
    return {
      claimed: coupons.length,
      redeemed: coupons.filter(c => c.status === 'redeemed').length,
      shared: stories.length,
    };
  }

  validateUserExists(userId: number | undefined): { valid: boolean; error?: string } {
    if (!userId) {
      return { valid: false, error: "User ID required" };
    }
    return { valid: true };
  }
}

export const userBusiness = new UserBusiness();
