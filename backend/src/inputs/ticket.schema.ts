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

const updateTicketCore = z.object({
  type: z.string().optional(),
  price: z
    .number()
    .refine((value) => Number.isInteger(value * 100), {
      message: "Price must have at most 2 decimal places",
    }).optional(),
  existentQuantity: z.number().optional(),
});

const updateTicketSchema = updateTicketCore.extend({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a UUID String"
  }).uuid(),
  event_id: z.string({
    required_error: "Event ID is required",
    invalid_type_error: "Event ID must be a UUID String"
  }).uuid()
})

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
export type UpdateTicketBody = z.infer<typeof updateTicketCore>;

export const schemas = {
  ticketCore,
  createTicketSchema,
  createTicketResponseSchema,
  updateTicketCore,
};
