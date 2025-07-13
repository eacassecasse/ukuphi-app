import { z } from 'zod';

export const VenueSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(50),
  capacity: z.number().int().positive(),
  contactPhone: z.string().regex(/^\+?[\d\s-]+$/).optional(),
  contactEmail: z.string().email().optional(),
  geoPoint: z.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/).optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  createdAt: z.date()
});

export const CreateVenueSchema = VenueSchema.pick({
  name: true,
  address: true,
  city: true,
  capacity: true,
  contactPhone: true,
  contactEmail: true,
  geoPoint: true,
  amenities: true,
  images: true
});

export const UpdateVenueSchema = CreateVenueSchema.partial();

export const VenuePaginatedResponseSchema = z.object({
  data: z.array(VenueSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number()
});