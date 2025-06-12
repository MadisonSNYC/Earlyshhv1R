import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  instagramId: text("instagram_id").notNull().unique(),
  username: text("username").notNull(),
  fullName: text("full_name").notNull(),
  profilePicUrl: text("profile_pic_url"),
  gender: text("gender"), // male, female, non-binary, prefer-not-to-say
  ageVerified: boolean("age_verified").notNull().default(false),
  accessToken: text("access_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  
  // Gamification fields
  totalFreeProducts: integer("total_free_products").notNull().default(0),
  totalSavings: decimal("total_savings", { precision: 8, scale: 2 }).notNull().default("0.00"),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  level: text("level").notNull().default("Newbie"), // Newbie, Explorer, Captain, Campus Influencer
  badges: text("badges").array().notNull().default([]), // Array of badge IDs
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  brandIgHandle: text("brand_ig_handle").notNull(),
  brandBio: text("brand_bio"), // Brand description/about section
  offerDescription: text("offer_description").notNull(),
  productName: text("product_name").notNull(),
  brandLogoUrl: text("brand_logo_url").notNull(),
  offerId: text("offer_id"), // TCB Master Offer ID for Phase II
  redeemableAmount: decimal("redeemable_amount", { precision: 8, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxCoupons: integer("max_coupons").notNull(),
  perUserLimit: integer("per_user_limit").notNull().default(1),
  status: text("status").notNull().default("active"), // active, paused, ended
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  radius: decimal("radius", { precision: 8, scale: 2 }).default("1.0"), // miles
  category: text("category").notNull().default("general"), // food, premium, nightlife, etc.
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  userId: integer("user_id").notNull().references(() => users.id),
  code: text("code").notNull().unique(),
  productName: text("product_name").notNull(),
  redeemableAmount: decimal("redeemable_amount", { precision: 8, scale: 2 }).notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  legalDisclaimer: text("legal_disclaimer").notNull(),
  qrData: text("qr_data").notNull(),
  fetchCode: text("fetch_code").notNull(),
  dateFetched: timestamp("date_fetched").notNull().defaultNow(),
  claimedAt: timestamp("claimed_at").notNull().defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
  status: text("status").notNull().default("claimed"), // claimed, redeemed, expired
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  couponId: integer("coupon_id").references(() => coupons.id),
  instagramStoryId: text("instagram_story_id"),
  postedAt: timestamp("posted_at").notNull(),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
  impressions: integer("impressions").default(0),
  reach: integer("reach").default(0),
  storyUrl: text("story_url"),
  metadata: jsonb("metadata"), // Additional story data
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  date: timestamp("date").notNull().defaultNow(),
  claimsIssued: integer("claims_issued").notNull().default(0),
  couponsRedeemed: integer("coupons_redeemed").notNull().default(0),
  storiesVerified: integer("stories_verified").notNull().default(0),
  totalReach: integer("total_reach").notNull().default(0),
  metadata: jsonb("metadata"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // new_deal, redemption_confirmed, achievement, story_verified, deal_expiring
  title: text("title").notNull(),
  message: text("message").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  actionUrl: text("action_url"), // optional deep link
  isRead: boolean("is_read").notNull().default(false),
  priority: text("priority").notNull().default("normal"), // high, normal, low
  metadata: jsonb("metadata"), // additional context data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  readAt: timestamp("read_at"),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Gamification tables
export const badges = pgTable("badges", {
  id: text("id").primaryKey(), // first_timer, streak_starter, free_product_captain, etc.
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // emoji or lucide icon name
  category: text("category").notNull(), // achievement, streak, social, etc.
  requirement: jsonb("requirement").notNull(), // conditions to earn this badge
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: text("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  progress: jsonb("progress"), // tracking progress towards badge completion
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  activityType: text("activity_type").notNull(), // product_claimed, story_posted, badge_earned, level_up
  metadata: jsonb("metadata").notNull(), // activity-specific data
  points: integer("points").notNull().default(0), // points earned from this activity
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  totalProducts: integer("total_products").notNull().default(0),
  totalSavings: decimal("total_savings", { precision: 8, scale: 2 }).notNull().default("0.00"),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  level: text("level").notNull().default("Newbie"),
  totalPoints: integer("total_points").notNull().default(0),
  storiesPosted: integer("stories_posted").notNull().default(0),
  friendsReferred: integer("friends_referred").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  dateFetched: true,
  claimedAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  detectedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});

// Feedback tracking tables
export const feedbackRequests = pgTable("feedback_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  couponId: integer("coupon_id").notNull().references(() => coupons.id),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  status: text("status").notNull().default("pending"), // pending, completed, bypassed, expired
  deadline: timestamp("deadline").notNull(),
  remindersSent: integer("reminders_sent").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  bypassReason: text("bypass_reason"),
});

export const productFeedback = pgTable("product_feedback", {
  id: serial("id").primaryKey(),
  feedbackRequestId: integer("feedback_request_id").notNull().references(() => feedbackRequests.id),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  overallRating: integer("overall_rating").notNull(), // 1-5 stars
  purchaseIntent: text("purchase_intent").notNull(), // definitely, probably, maybe, unlikely, never
  experience: text("experience"), // detailed feedback text
  improvements: text("improvements"), // suggested improvements
  wouldRecommend: boolean("would_recommend").notNull(),
  productQuality: integer("product_quality"), // 1-5 stars
  packaging: integer("packaging"), // 1-5 stars
  value: integer("value"), // 1-5 stars
  brandHelpfulness: integer("brand_helpfulness"), // Brand rates this feedback 1-5
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaignAccessLog = pgTable("campaign_access_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  accessAttemptedAt: timestamp("access_attempted_at").defaultNow().notNull(),
  blocked: boolean("blocked").notNull().default(false),
  blockReason: text("block_reason"), // pending_feedback, deadline_passed, etc
  pendingFeedbackCount: integer("pending_feedback_count").default(0),
});

export const insertFeedbackRequestSchema = createInsertSchema(feedbackRequests).omit({
  id: true,
  createdAt: true,
});

export const insertProductFeedbackSchema = createInsertSchema(productFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignAccessLogSchema = createInsertSchema(campaignAccessLog).omit({
  id: true,
  accessAttemptedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type FeedbackRequest = typeof feedbackRequests.$inferSelect;
export type InsertFeedbackRequest = z.infer<typeof insertFeedbackRequestSchema>;
export type ProductFeedback = typeof productFeedback.$inferSelect;
export type InsertProductFeedback = z.infer<typeof insertProductFeedbackSchema>;
export type CampaignAccessLog = typeof campaignAccessLog.$inferSelect;
export type InsertCampaignAccessLog = z.infer<typeof insertCampaignAccessLogSchema>;
