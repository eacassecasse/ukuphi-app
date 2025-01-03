import * as z from "zod";

const notificationCore = z.object({
  message: z.string({ required_error: "Message is required" }),
  type: z.enum(["info", "warning", "error"], {
    required_error: "Type is required",
    invalid_type_error: "Type must be one of: info, warning, error",
  }),
});

const createNotificationSchema = notificationCore;

const createNotificationResponseSchema = notificationCore.extend({
  id: z.string(),
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
