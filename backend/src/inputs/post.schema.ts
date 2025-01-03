import * as z from "zod";

const createPostSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  content: z.string({
    required_error: "Content is required",
  }),
  featured_image: z
    .string({
      required_error: "Featured Image is required",
      invalid_type_error: "Feature Image must be a valid URL",
    })
    .url(),
});

const updatePostSchema = createPostSchema.extend({
  id: z.string(),
});

const createPostResponseSchema = createPostSchema.extend({
  id: z.string(),
  published_at: z.date(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreatePostResponse = z.infer<typeof createPostResponseSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const schemas = {
  createPostSchema,
  createPostResponseSchema,
};
