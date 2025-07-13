import {
  UserRoleSchema,
  VerificationStatusSchema,
} from "@/lib/schemas/schemas.enums";
import { z } from "zod";

// Mozambique phone validation (+258 or 0 prefix)
const PhoneSchema = z.string().regex(/^(\+258|0)?[82-87][0-9]{7}$/, {
  message: "Invalid Mozambique phone number",
});

// Secure password validation (matches Prisma's String type)
const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password too long");

// Registration (matches User model fields)
export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: PhoneSchema,
  password: PasswordSchema,
  role: UserRoleSchema.optional().default("ATTENDEE"),
  marketingOptIn: z.boolean().default(false), // From User.marketingOptIn
});

// Login (uses unique fields from User model)
export const LoginSchema = z.object({
  email: z.string().email().or(PhoneSchema), // Can login with email or phone
  password: z.string(),
});

// Auth response (matches User model + tokens)
export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    role: UserRoleSchema,
    verificationStatus: VerificationStatusSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

// Verification (for your verificationStatus field)
export const VerifyEmailSchema = z.object({
  token: z.string(),
});

export const VerifyPhoneSchema = z.object({
  code: z.string().length(6),
});

// Password reset (uses User's email/phone)
export const RequestPasswordResetSchema = z.object({
  email: z.string().email().or(PhoneSchema),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: PasswordSchema,
});

export type RegisterUser = z.infer<typeof RegisterSchema>;
export type LoginUser = z.infer<typeof LoginSchema>;