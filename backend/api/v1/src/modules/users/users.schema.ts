import * as z from "zod";
import {
  UserRoleSchema,
  VerificationStatusSchema,
} from "@lib/schemas/schemas.enums";
import { User } from "@prisma/client";

// Base User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(9).max(15),
  password: z.string().min(8),
  role: UserRoleSchema.default("ATTENDEE"),
  verificationStatus: VerificationStatusSchema.default("UNVERIFIED"),
  preferredLanguage: z.string().default("pt-MZ"),
  accountCredit: z.number().default(0.0),
  marketingOptIn: z.boolean().default(false),
  lastLogin: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create User Input
export const CreateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  phone: true,
  password: true,
}).extend({
  role: UserRoleSchema.optional(),
  marketingOptIn: z.boolean().optional(),
});

// Update User Input
export const UpdateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  phone: true,
  preferredLanguage: true,
  marketingOptIn: true,
}).partial();

// Login Input
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Auth Response
export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema.omit({ password: true }),
});

// Paginated User Response
export const UserPaginatedResponseSchema = z.object({
  data: z.array(UserSchema.omit({ password: true })),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UserDTO = Omit<User, "shard">;
