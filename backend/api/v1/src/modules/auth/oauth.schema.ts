import { z } from 'zod';

// OAuth provider enum
export const OAuthProviderSchema = z.enum([
  'google',
  'facebook',
  'apple',
  'microsoft'
]);

// OAuth token exchange
export const OAuthTokenSchema = z.object({
  provider: OAuthProviderSchema,
  code: z.string(),
  redirectUri: z.string().url()
});

// OAuth profile
export const OAuthProfileSchema = z.object({
  provider: OAuthProviderSchema,
  providerId: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url().optional(),
  emailVerified: z.boolean().default(false)
});