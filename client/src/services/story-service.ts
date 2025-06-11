
import { apiClient } from '@/lib/api-client';

export interface Story {
  id: number;
  userId: number;
  campaignId: number;
  couponId: number | null;
  instagramStoryId: string | null;
  postedAt: string;
  impressions: number;
  reach: number;
  storyUrl: string | null;
  metadata: any;
  detectedAt: string;
}

export class StoryService {
  async createStory(data: {
    campaignId: number;
    couponId?: number;
    instagramStoryId?: string;
    impressions?: number;
    reach?: number;
  }): Promise<Story> {
    try {
      const response = await apiClient.createStory(data);
      return response.story;
    } catch (error) {
      throw new Error(`Failed to create story: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validateStoryData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.campaignId || typeof data.campaignId !== 'number') {
      errors.push('Campaign ID is required');
    }

    if (data.impressions && (typeof data.impressions !== 'number' || data.impressions < 0)) {
      errors.push('Impressions must be a positive number');
    }

    if (data.reach && (typeof data.reach !== 'number' || data.reach < 0)) {
      errors.push('Reach must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatStoryMetrics(story: Story): string {
    const metrics = [];
    if (story.impressions > 0) metrics.push(`${story.impressions} impressions`);
    if (story.reach > 0) metrics.push(`${story.reach} reach`);
    return metrics.join(', ') || 'No metrics available';
  }

  calculateEngagementRate(story: Story): number {
    if (story.impressions === 0) return 0;
    return (story.reach / story.impressions) * 100;
  }
}

export const storyService = new StoryService();
