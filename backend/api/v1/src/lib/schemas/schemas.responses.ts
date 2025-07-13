import { z } from 'zod';

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional()
});

export const ErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional()
  })
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) => 
  z.object({
    data: z.array(schema),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean()
    })
  });