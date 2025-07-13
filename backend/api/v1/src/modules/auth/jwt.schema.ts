import { z } from "zod";
import { UserRoleSchema } from "@lib/schemas/schemas.enums";

// JWT payload
export const JWTPayloadSchema = z.object({
  sub: z.string().uuid(), // user ID
  jti: z.string().uuid(), // session ID
  role: UserRoleSchema,
  iat: z.number().int(), // issued at
  exp: z.number().int(), // expiration
});

// Access token claims
export const AccessTokenClaimsSchema = JWTPayloadSchema.extend({
  type: z.literal("access"),
});

// Refresh token claims
export const RefreshTokenClaimsSchema = JWTPayloadSchema.extend({
  type: z.literal("refresh"),
});

// API key claims
export const ApiKeyClaimsSchema = z.object({
  sub: z.string().uuid(), // client ID
  scope: z.array(z.string()),
  iat: z.number().int(),
  exp: z.number().int(),
});
