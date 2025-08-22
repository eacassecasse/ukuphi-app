import { z } from 'zod/v4';

// Pagination
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  shard: z.coerce.number().int().nonnegative().optional()
});

// Filtering
export const DateRangeSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional()
});

// Sorting
export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc')
});

// Search
export const SearchSchema = z.object({
  query: z.string().min(1),
  fields: z.array(z.string()).optional()
});

// Geo Location
export const GeoSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().positive().default(10) // in km
});