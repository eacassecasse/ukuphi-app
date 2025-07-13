import { z } from "zod";

export const RateLimitConfigSchema = z.object({
  windowMs: z
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000), // 15 minutes
  max: z.number().int().positive().default(100), // limit each IP to 100 requests per windowMs
  message: z.string().default("Too many requests, please try again later"),
  statusCode: z.number().int().default(429),
  headers: z.boolean().default(true),
});

export const RateLimitResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  retryAfter: z.number().optional(),
});
