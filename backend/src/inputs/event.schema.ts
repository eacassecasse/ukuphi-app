import * as z from "zod";
import dayjs from "dayjs";

const dateSchema = z
  .string({
    required_error: "Date is required",
  })
  .refine((value) => dayjs(value, "YYYY-MM-DD HH:mm:ss", true).isValid(), {
    message: "Date must be in the format YYYY-MM-DD HH:mm:ss and valid",
  });

const eventCore = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  location: z.string({ required_error: "Location is required" }),
  image_url: z.string().url({
    message: "Image URL must be a valid URL",
  }),
  date: dateSchema,
});

const createEventSchema = eventCore;

const updateEventCore = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  image_url: z.string().url().optional(),
  date: dateSchema.optional(),
});

const updateEventSchema = updateEventCore.extend({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a UUID String"
  }).uuid()
})

const createEventResponseSchema = eventCore.extend({
  id: z.string(),
  tickets_sold: z.number().default(0),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateEventResponse = z.infer<typeof createEventResponseSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type UpdateEventBody = z.infer<typeof updateEventCore>;

export const schemas = {
  createEventSchema,
  createEventResponseSchema,
  updateEventCore,
};
