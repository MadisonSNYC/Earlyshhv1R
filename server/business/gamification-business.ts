import { storage } from '../storage';
import { 
  InsertUserActivity, 
  InsertUserBadge, 
  Badge, 
  UserBadge, 
  User,
  InsertNotification
} from '../../shared/schema';

// Badge definitions from the gamification plan
export const BADGE_DEFINITIONS: Record<string, Badge> = {
  first_timer: {
    id: 'first_timer',
    name: 'First Timer',
    description: 'Got your first free product!',
    icon: '🎯',
    category: 'achievement',
    requirement: { type: 'products_claimed', count: 1 },
    isActive: true,
    createdAt: new Date()
  },
  streak_starter: {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: '3 days in a row!',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', count: 3 },
    isActive: true,
    createdAt: new Date()
  },
  free_product_captain: {
    id: 'free_product_captain',
    name: 'Free Product Captain',
    description: '10 free products claimed',
    icon: '💪',
    category: 'achievement',
    requirement: { type: 'products_claimed', count: 10 },
    isActive: true,
    createdAt: new Date()
  },
  campus_influencer: {
    id: 'campus_influencer',
    name: 'Campus Influencer',
    description: 'Shared 5 stories this month',
    icon: '🏫',
    category: 'social',
    requirement: { type: 'stories_posted', count: 5, timeframe: 'month' },
    isActive: true,
    createdAt: new Date()
  },
  community_hero: {
    id: 'community_hero',
    name: 'Community Hero',
    description: 'Helped 3 friends join',
    icon: '💎',
    category: 'social',
    requirement: { type: 'friends_referred', count: 3 },
    isActive: true,
    createdAt: new Date()
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Claimed within 1 hour of posting',
    icon: '⚡',
    category: 'engagement',
    requirement: { type: 'quick_claim', timeLimit: 3600 }, // 1 hour in seconds
    isActive: true,
    createdAt: new Date()
  }
};

// Level progression rules
export const LEVEL_THRESHOLDS = {
  'Newbie': { minProducts: 0, maxProducts: 2 },
  'Explorer': { minProducts: 3, maxProducts: 9 },
  'Captain': { minProducts: 10, maxProducts: 24 },
  'Campus Influencer': { minProducts: 25, maxProducts: Infinity }
};

export class GamificationBusiness {
  /**
   * Initialize badges in the system (run once during setup)
   */
  async initializeBadges() {
    for (const badge of Object.values(BADGE_DEFINITIONS)) {
      await storage.createBadge(badge);
    }
  }

  /**
   * Track user activity and trigger gamification logic
   */
  async trackActivity(userId: number, activityType: string, metadata: any = {}) {
    const points = this.calculatePoints(activityType, metadata);
    
    const activity: InsertUserActivity = {
      userId,
      activityType,
      metadata,
      points
    };

    await storage.createUserActivity(activity);
    
    // Update user stats
    await this.updateUserStats(userId, activityType, metadata);
    
    // Check for new badges
    await this.checkAndAwardBadges(userId);
    
    // Check for level progression
    await this.checkLevelProgression(userId);

    return activity;
  }

  /**
   * Calculate points for different activities
   */
  private calculatePoints(activityType: string, metadata: any): number {
    const pointsMap: Record<string, number> = {
      'product_claimed': 10,
      'story_posted': 15,
      'product_redeemed': 5,
      'badge_earned': 25,
      'level_up': 50,
      'friend_referred': 30
    };

    let basePoints = pointsMap[activityType] || 0;

    // Bonus points for speed claims
    if (activityType === 'product_claimed' && metadata.claimTime && metadata.claimTime <= 3600) {
      basePoints += 5; // +5 points for claims within 1 hour
    }

    return basePoints;
  }

  /**
   * Update user statistics based on activity
   */
  private async updateUserStats(userId: number, activityType: string, metadata: any) {
    const user = await storage.getUser(userId);
    if (!user) return;

    const updates: Partial<User> = {
      lastActivityDate: new Date()
    };

    switch (activityType) {
      case 'product_claimed':
        updates.totalFreeProducts = (user.totalFreeProducts || 0) + 1;
        updates.totalSavings = String(
          parseFloat(user.totalSavings || "0") + parseFloat(metadata.savings || "0")
        );
        
        // Update streak
        const lastActivity = user.lastActivityDate;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (!lastActivity || this.isSameDay(lastActivity, today)) {
          // Same day, no streak change
        } else if (this.isSameDay(lastActivity, yesterday)) {
          // Consecutive day, increment streak
          updates.currentStreak = (user.currentStreak || 0) + 1;
          if (updates.currentStreak > (user.longestStreak || 0)) {
            updates.longestStreak = updates.currentStreak;
          }
        } else {
          // Streak broken, reset to 1
          updates.currentStreak = 1;
        }
        break;

      case 'story_posted':
        // This would be tracked when stories are verified/detected
        break;
    }

    await storage.updateUser(userId, updates);
  }

  /**
   * Check if user has earned any new badges
   */
  private async checkAndAwardBadges(userId: number) {
    const user = await storage.getUser(userId);
    const userBadges = await storage.getUserBadges(userId);
    const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

    for (const badge of Object.values(BADGE_DEFINITIONS)) {
      if (earnedBadgeIds.includes(badge.id)) continue; // Already earned

      if (await this.checkBadgeRequirement(userId, badge)) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }

  /**
   * Check if user meets badge requirements
   */
  private async checkBadgeRequirement(userId: number, badge: Badge): Promise<boolean> {
    const user = await storage.getUser(userId);
    if (!user) return false;

    const requirement = badge.requirement as any;

    switch (requirement.type) {
      case 'products_claimed':
        return (user.totalFreeProducts || 0) >= requirement.count;

      case 'streak_days':
        return (user.currentStreak || 0) >= requirement.count;

      case 'stories_posted':
        if (requirement.timeframe === 'month') {
          // Would need to query stories from last month
          const monthlyStories = await storage.getUserStoriesInTimeframe(userId, 'month');
          return monthlyStories >= requirement.count;
        }
        return false;

      case 'friends_referred':
        // This would need a referral tracking system
        return false; // Placeholder

      case 'quick_claim':
        // This is checked at claim time with metadata
        return false; // Handled differently

      default:
        return false;
    }
  }

  /**
   * Award a badge to a user
   */
  private async awardBadge(userId: number, badgeId: string) {
    const userBadge: InsertUserBadge = {
      userId,
      badgeId
    };

    await storage.createUserBadge(userBadge);

    // Track the badge earning activity
    await this.trackActivity(userId, 'badge_earned', { badgeId });

    // Send notification
    const badge = BADGE_DEFINITIONS[badgeId];
    if (badge) {
      const notification: InsertNotification = {
        userId,
        type: 'badge_earned',
        title: 'New Badge Earned!',
        message: `You've earned the "${badge.name}" badge! ${badge.description}`,
        icon: 'trophy',
        priority: 'high'
      };

      await storage.createNotification(notification);
    }
  }

  /**
   * Check and update user level progression
   */
  private async checkLevelProgression(userId: number) {
    const user = await storage.getUser(userId);
    if (!user) return;

    const currentLevel = user.level || 'Newbie';
    const newLevel = this.calculateLevel(user.totalFreeProducts || 0);

    if (newLevel !== currentLevel) {
      await storage.updateUser(userId, { level: newLevel });
      
      // Track level up activity
      await this.trackActivity(userId, 'level_up', { 
        oldLevel: currentLevel, 
        newLevel 
      });

      // Send notification
      const notification: InsertNotification = {
        userId,
        type: 'level_up',
        title: 'Level Up!',
        message: `Congratulations! You're now a ${newLevel}!`,
        icon: 'star',
        priority: 'high'
      };

      await storage.createNotification(notification);
    }
  }

  /**
   * Calculate user level based on products claimed
   */
  private calculateLevel(totalProducts: number): string {
    for (const [level, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
      if (totalProducts >= threshold.minProducts && totalProducts <= threshold.maxProducts) {
        return level;
      }
    }
    return 'Newbie';
  }

  /**
   * Get user's gamification summary
   */
  async getUserGamificationSummary(userId: number) {
    const user = await storage.getUser(userId);
    const userBadges = await storage.getUserBadges(userId);
    const recentActivities = await storage.getUserRecentActivities(userId, 10);

    if (!user) return null;

    const nextLevelInfo = this.getNextLevelInfo(user.totalFreeProducts || 0);
    const availableBadges = await this.getAvailableBadges(userId);

    return {
      level: user.level || 'Newbie',
      totalProducts: user.totalFreeProducts || 0,
      totalSavings: parseFloat(user.totalSavings || "0"),
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      earnedBadges: userBadges,
      recentActivities,
      nextLevel: nextLevelInfo,
      availableBadges
    };
  }

  /**
   * Get information about the next level
   */
  private getNextLevelInfo(currentProducts: number) {
    const currentLevel = this.calculateLevel(currentProducts);
    const levels = Object.keys(LEVEL_THRESHOLDS);
    const currentIndex = levels.indexOf(currentLevel);
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      const threshold = LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS];
      
      return {
        name: nextLevel,
        productsNeeded: threshold.minProducts - currentProducts,
        progress: Math.min(100, (currentProducts / threshold.minProducts) * 100)
      };
    }

    return null; // Max level reached
  }

  /**
   * Get badges available to earn (not yet earned)
   */
  private async getAvailableBadges(userId: number) {
    const userBadges = await storage.getUserBadges(userId);
    const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

    return Object.values(BADGE_DEFINITIONS)
      .filter(badge => !earnedBadgeIds.includes(badge.id))
      .map(badge => ({
        ...badge,
        progress: 0 // Would calculate actual progress towards badge
      }));
  }

  /**
   * Utility function to check if two dates are the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}

export const gamificationBusiness = new GamificationBusiness();