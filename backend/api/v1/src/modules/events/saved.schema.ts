import { z } from 'zod';

export const SavedEventSchema = z.object({
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
  createdAt: z.date()
});

export const ToggleSavedEventSchema = z.object({
  eventId: z.string().uuid()
});