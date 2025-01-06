import * as z from "zod";

const paymentCore = z.object({
  amount: z.number({
    required_error: "Amount is required",
  }),
  method: z.enum(["DEBIT_CARD", "CREDIT_CARD", "MOBILE_WALLET"],{
    required_error: "Method is required",
    invalid_type_error: "Type must be one of: debit_card, credit_card, mobile_wallet"
  }),
});

const createPaymentSchema = paymentCore.extend({
  ticket_id: z
    .string({
      invalid_type_error: "The Ticket ID must be a valid UUID String",
    })
    .uuid(),
});

const updatePaymentCore = z.object({
  amount: z.number().optional(),
  method: z.string().optional(),
});

const updatePaymentSchema = updatePaymentCore.extend({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a UUID String"
  }).uuid()
})

const createPaymentResponseSchema = paymentCore.extend({
  id: z.string(),
  status: z.string(),
  qr_code: z.string(),
  created_at: z.date(),
  ticket: z.object({
    id: z.string(),
    type: z.string(),
    price: z.number(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreatePaymentResponse = z.infer<typeof createPaymentResponseSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type UpdatePaymentBody = z.infer<typeof updatePaymentCore>;

export const schemas = {
  createPaymentSchema,
  createPaymentResponseSchema,
  paymentCore,
  updatePaymentCore
};
