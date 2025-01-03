import * as z from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is not valid",
    })
    .email(),
  password: z.string({
    required_error: "Password is required",
  }),
});

const loginResponseSchema = z.object({
  accessToken: z.string()
});

const jsonLoginSchema = zodToJsonSchema(loginSchema);
const jsonLoginResponseSchema = zodToJsonSchema(loginResponseSchema);

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const schemas = {
  loginSchema,
  loginResponseSchema,
  jsonLoginSchema,
  jsonLoginResponseSchema
};
