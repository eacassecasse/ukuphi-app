import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
  .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
  .regex(/[0-9]/, { message: "Password must include a number" });

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is not valid",
    })
    .email(),
  password: passwordSchema
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const jsonLoginSchema = zodToJsonSchema(loginSchema);
const jsonLoginResponseSchema = zodToJsonSchema(loginResponseSchema);

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const schemas = {
  loginSchema,
  loginResponseSchema,
  jsonLoginSchema,
  jsonLoginResponseSchema,
};
