import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CLOUDINARY_URL: z.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_SECRET: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
  NEXT_PUBLIC_GOOGLE_MAP_API: z.string(),
  NEXT_PUBLIC_GOOGLE_MAP_ID: z.string(),
  NEXT_PUBLIC_API_BASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
