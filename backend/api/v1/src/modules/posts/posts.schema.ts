import { z } from 'zod';
import { PostStatusSchema } from '@lib/schemas/schemas.enums';

export const PostTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(30),
  slug: z.string().regex(/^[a-z0-9-]+$/)
});

export const PostSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  excerpt: z.string().max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  featuredImage: z.string().url().optional(),
  location: z.string().optional(),
  status: PostStatusSchema.default('DRAFT'),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreatePostSchema = PostSchema.pick({
  title: true,
  content: true,
  excerpt: true,
  featuredImage: true,
  location: true,
  status: true
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const PostCommentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  title: z.string().min(3).max(100),
  content: z.string().min(3).max(500),
  createdAt: z.date()
});

export const CreateCommentSchema = PostCommentSchema.pick({
  postId: true,
  title: true,
  content: true
});