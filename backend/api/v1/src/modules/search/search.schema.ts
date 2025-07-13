import { z } from 'zod';

export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.record(z.unknown()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sort: z.string().optional()
});

export const SearchResultItemSchema = z.object({
  id: z.string(),
  type: z.enum(['event', 'venue', 'user', 'post']),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional()
});

export const SearchResponseSchema = z.object({
  results: z.array(SearchResultItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive()
});