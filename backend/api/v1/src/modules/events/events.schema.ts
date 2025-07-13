import * as z from "zod";
import dayjs from "dayjs";
import { Event } from "@prisma/client";
import { EventStatusSchema } from "@/lib/schemas/schemas.enums";

const dateSchema = z
  .string({
    required_error: "Date is required",
  })
  .refine((value) => dayjs(value, "YYYY-MM-DD HH:mm:ss", true).isValid(), {
    message: "Date must be in the format YYYY-MM-DD HH:mm:ss and valid",
  });

export const EventSchema = z.object({
  id: z.string().uuid(),
  organizerId: z.string().uuid(),
  venueId: z.string().uuid().optional(),
  categoryId: z.string().uuid(),
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  status: EventStatusSchema.default("DRAFT"),
  isOnline: z.boolean().default(false),
  onlineURL: z.string().url().optional(),
  imageURL: z.string().url(),
  date: z.date(),
  endDate: z.date().optional(),
  timezone: z.string().default("Africa/Maputo"),
  ageRestriction: z.string().optional(),
  headerImage: z.string().url().optional(),
  cancellationPolicy: z.string().optional(),
  termsAndConditions: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEventSchema = EventSchema.pick({
  title: true,
  description: true,
  categoryId: true,
  venueId: true,
  isOnline: true,
  onlineURL: true,
  imageURL: true,
  date: true,
  endDate: true,
  ageRestriction: true,
  headerImage: true,
  cancellationPolicy: true,
  termsAndConditions: true,
}).extend({
  timezone: z.string().optional(),
});

export const UpdateEventSchema = CreateEventSchema.partial();

export const EventPaginatedResponseSchema = z.object({
  data: z.array(EventSchema),
  links: z.object({
    next: z.string().optional(),
  }),
});

export type CreateEvent = z.infer<typeof CreateEventSchema>;

export type EventDTO = Omit<Event, "shard">;
