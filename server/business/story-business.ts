
import { storage } from "../storage";
import type { Story, InsertStory } from "@shared/schema";

export class StoryBusiness {
  async createStory(data: {
    userId: number;
    campaignId: number;
    couponId?: number;
    instagramStoryId?: string;
    impressions?: number;
    reach?: number;
  }): Promise<Story> {
    const storyData: InsertStory = {
      userId: data.userId,
      campaignId: data.campaignId,
      couponId: data.couponId || null,
      instagramStoryId: data.instagramStoryId || null,
      postedAt: new Date(),
      impressions: data.impressions || 0,
      reach: data.reach || 0,
      storyUrl: null,
      metadata: null,
    };

    return await storage.createStory(storyData);
  }

  validateStoryData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.campaignId || typeof data.campaignId !== 'number') {
      errors.push('Campaign ID is required');
    }

    if (!data.userId || typeof data.userId !== 'number') {
      errors.push('User ID is required');
    }

    if (data.impressions && (typeof data.impressions !== 'number' || data.impressions < 0)) {
      errors.push('Impressions must be a positive number');
    }

    if (data.reach && (typeof data.reach !== 'number' || data.reach < 0)) {
      errors.push('Reach must be a positive number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const storyBusiness = new StoryBusiness();
