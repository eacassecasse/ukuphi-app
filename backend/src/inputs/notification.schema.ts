import * as z from "zod";

const notificationCore = z.object({
  message: z.string({ required_error: "Message is required" }),
  type: z.enum(["INFO", "WARNING", "ERROR"], {
    required_error: "Type is required",
    invalid_type_error: "Type must be one of: info, warning, error",
  }),
  status: z.enum(["UNREAD", "READ"]).default("UNREAD")
});

const createNotificationSchema = notificationCore;

const createNotificationResponseSchema = notificationCore.extend({
  id: z.string(),
  sentAt: z.date(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email({ message: "Email must be valid" }),
  }),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type CreateNotificationResponse = z.infer<typeof createNotificationResponseSchema>;

export const schemas = {
  createNotificationSchema,
  createNotificationResponseSchema,
};
