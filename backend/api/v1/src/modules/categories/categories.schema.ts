import { z } from 'zod';

export const EventCategorySchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  name: z.string().min(3).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  iconUrl: z.string().url().optional(),
  isPrimary: z.boolean().default(false)
});

export const CreateEventCategorySchema = EventCategorySchema.pick({
  name: true,
  slug: true,
  parentId: true,
  iconUrl: true,
  isPrimary: true
});

export const UpdateEventCategorySchema = CreateEventCategorySchema.partial();

export const CategoryTreeSchema = EventCategorySchema.extend({
  children: z.lazy(() => z.array(CategoryTreeSchema))
});