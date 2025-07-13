import { z } from 'zod';

export const EventReviewSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  isVerified: z.boolean().default(false),
  createdAt: z.date()
});

export const CreateReviewSchema = EventReviewSchema.pick({
  eventId: true,
  rating: true,
  comment: true
});

export const UpdateReviewSchema = CreateReviewSchema.partial();

export const ReviewStatsSchema = z.object({
  averageRating: z.number().min(1).max(5),
  totalReviews: z.number().int().nonnegative(),
  ratingDistribution: z.record(z.number().int().nonnegative())
});