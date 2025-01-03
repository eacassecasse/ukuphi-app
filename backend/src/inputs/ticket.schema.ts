import * as z from "zod";

const ticketCore = z.object({
  type: z.string({
    required_error: "Type is required",
  }),
  price: z
    .number({
      required_error: "Price is required",
    })
    .refine((value) => Number.isInteger(value * 100), {
      message: "Price must have at most 2 decimal places",
    }),
  existentQuantity: z.number({
    required_error: "Existent Quantity is required",
  }),
});

const createTicketSchema = ticketCore.extend({
  event_id: z
    .string({
      invalid_type_error: "The Ticket ID must be a valid UUID String",
    })
    .uuid(),
});

const updateTicketSchema = createTicketSchema.extend({
  id: z.string(),
});

const createTicketResponseSchema = ticketCore.extend({
  id: z.string(),
  event: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    date: z.date(),
  }),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type CreateTicketResponse = z.infer<typeof createTicketResponseSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export const schemas = {
  ticketCore,
  createTicketSchema,
  createTicketResponseSchema,
  updateTicketSchema,
};
