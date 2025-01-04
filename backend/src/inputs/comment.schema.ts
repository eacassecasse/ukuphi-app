import * as z from "zod";

const uuidSchema = z.string().uuid({ message: "Must be a valid UUID string" });

const createCommentSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  content: z.string({
    required_error: "Content is required",
  }),
});

const createEventCommentSchema = createCommentSchema.extend({
  event_id: uuidSchema
});

const updateCommentSchema = createEventCommentSchema.extend({
  id: uuidSchema
});

const createPostCommentSchema = createCommentSchema.extend({
  post_id: uuidSchema
});

const createCommentResponseCore = createCommentSchema.extend({
  id: uuidSchema,
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

const createEventCommentResponseSchema = createCommentResponseCore.extend({
  event: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    date: z.date(),
  }),
});

const createPostCommentResponseSchema = createCommentResponseCore.extend({
  post: z.object({
    id: uuidSchema,
    title: z.string(),
    publishedAt: z.date(),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateEventCommentInput = z.infer<typeof createEventCommentSchema>;
export type CreateEventCommentResponse = z.infer<
  typeof createEventCommentResponseSchema
>;
export type CreatePostCommentInput = z.infer<typeof createPostCommentSchema>;
export type CreatePostCommentResponse = z.infer<
  typeof createPostCommentResponseSchema
>;
export type UpdateEventCommentInput = z.infer<typeof updateCommentSchema>;

export const schemas = {
  createCommentSchema,
  createEventCommentSchema,
  createEventCommentResponseSchema,
  createPostCommentSchema,
  createPostCommentResponseSchema,
};
