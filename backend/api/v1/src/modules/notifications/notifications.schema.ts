import { z } from "zod";
import { NotificationTypeSchema } from "@lib/schemas/schemas.enums";

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(3).max(100),
  message: z.string().min(3).max(500),
  type: NotificationTypeSchema,
  isRead: z.boolean().default(false),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
});

export const CreateNotificationSchema = NotificationSchema.pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  metadata: true,
});

export const MarkAsReadSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export const NotificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  sms: z.boolean().default(false),
});
