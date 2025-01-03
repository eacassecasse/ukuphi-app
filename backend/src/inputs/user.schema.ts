import * as z from "zod";

const userCore = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is not valid",
    })
    .email(),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  phone: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be a string",
    })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "Phone number must be a valid international format (e.g., +1234567890)",
    }),
  role: z
    .string({
      invalid_type_error: "Role must be a string",
    })
    .optional(),
});

const createUserSchema = userCore.extend({
  password: z.string({
    required_error: "Password is required",
  }),
});

const updateUserCore = z.object({
  email: z
    .string({
      invalid_type_error: "Email is not valid",
    })
    .email()
    .optional(),
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .optional(),
  phone: z
    .string({
      invalid_type_error: "Phone number must be a string",
    })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "Phone number must be a valid international format (e.g., +1234567890)",
    })
    .optional(),
  role: z
    .string({
      invalid_type_error: "Role must be a string",
    })
    .optional(),
  password: z.string().optional(),
});

const updateUserSchema = updateUserCore.extend({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a UUID String"
  }).uuid()
})

const createUserResponseSchema = userCore.extend({
  id: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserCore>;

export const schemas = {
  createUserSchema,
  createUserResponseSchema,
  updateUserCore,
};
