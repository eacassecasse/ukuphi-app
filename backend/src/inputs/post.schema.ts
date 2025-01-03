import dayjs from "dayjs";
import * as z from "zod";

const dateSchema = z
  .string({
    required_error: "Date is required",
  })
  .refine((value) => dayjs(value, "YYYY-MM-DD HH:mm:ss", true).isValid(), {
    message: "Date must be in the format YYYY-MM-DD HH:mm:ss and valid",
  });

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

const updatePostCore = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  featured_image: z
    .string({
      invalid_type_error: "Feature Image must be a valid URL",
    })
    .url()
    .optional(),
});

const updatePostSchema = updatePostCore.extend({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a UUID String"
  }).uuid()
})

const createPostResponseSchema = createPostSchema.extend({
  id: z.string(),
  published_at: dateSchema,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreatePostResponse = z.infer<typeof createPostResponseSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type UpdatePostBody = z.infer<typeof updatePostCore>;

export const schemas = {
  createPostSchema,
  createPostResponseSchema,
  updatePostCore
};
