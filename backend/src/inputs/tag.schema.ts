import * as z from "zod";

const tagCore = z.object({
  content: z.string({
    required_error: "Content is required",
  }),
});

const createTagSchema = tagCore.extend({
  post_id: z
    .string({
      invalid_type_error: "The Post ID must be a valid UUID String",
    })
    .uuid(),
});

const createTagResponseSchema = tagCore.extend({
  id: z.string(),
  post: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    featured_image: z.string(),
    published_at: z.date()
  }),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type CreateTagResponse = z.infer<typeof createTagResponseSchema>;

export const schemas = {
  tagCore,
  createTagSchema,
  createTagResponseSchema,
};
