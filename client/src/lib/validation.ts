
import { z } from 'zod';

// User validation schemas
export const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profilePicture: z.string().url('Invalid profile picture URL').optional(),
});

// Campaign validation schemas
export const campaignFilterSchema = z.object({
  category: z.string().optional(),
  priceRange: z.tuple([z.number().min(0), z.number().min(0)]).optional(),
  radius: z.number().min(0.1).max(50).optional(),
  search: z.string().max(100).optional(),
});

export const claimCouponSchema = z.object({
  campaignId: z.number().int().positive(),
  userLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

// Story validation schemas
export const storySubmissionSchema = z.object({
  couponId: z.number().int().positive(),
  content: z.string().min(10, 'Story must be at least 10 characters').max(2000),
  mediaUrls: z.array(z.string().url()).max(5, 'Maximum 5 media files allowed').optional(),
  hashtags: z.array(z.string().regex(/^[a-zA-Z0-9_]+$/, 'Invalid hashtag format')).max(10).optional(),
});

// Settings validation schemas
export const notificationSettingsSchema = z.object({
  newCoupons: z.boolean(),
  expiringCoupons: z.boolean(),
  marketing: z.boolean(),
  stories: z.boolean(),
});

export const privacySettingsSchema = z.object({
  shareLocation: z.boolean(),
  shareStories: z.boolean(),
  profileVisible: z.boolean(),
});

// Validation helper functions
export function validateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}

export function validateCampaignFilters(data: unknown) {
  return campaignFilterSchema.safeParse(data);
}

export function validateCouponClaim(data: unknown) {
  return claimCouponSchema.safeParse(data);
}

export function validateStorySubmission(data: unknown) {
  return storySubmissionSchema.safeParse(data);
}

export function validateNotificationSettings(data: unknown) {
  return notificationSettingsSchema.safeParse(data);
}

export function validatePrivacySettings(data: unknown) {
  return privacySettingsSchema.safeParse(data);
}

// Form validation hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  return {
    validate: (data: unknown) => schema.safeParse(data),
    validateField: (field: string, value: unknown) => {
      try {
        const fieldSchema = (schema as any).shape[field];
        if (fieldSchema) {
          return fieldSchema.safeParse(value);
        }
        return { success: true, data: value };
      } catch {
        return { success: true, data: value };
      }
    }
  };
}
