import { z } from "zod";

const envSchema = z.object({
  // Next.js
  NEXT_PUBLIC_BASE_URL: z.string().min(1, "NEXT_PUBLIC_BASE_URL is required"),

  // Database
  LIBSQL_TOKEN: z.string().min(1, "LIBSQL_TOKEN is required"),
  LIBSQL_URL: z.string().min(1, "LIBSQL_URL is required"),

  // Payments
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  STRIPE_CONNECT_WEBHOOK_SECRET: z
    .string()
    .min(1, "STRIPE_CONNECT_WEBHOOK_SECRET is required"),

  // Google API keys
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // Stream
  NEXT_PUBLIC_STREAM_API_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STREAM_API_KEY is required"),
  STREAM_SECRET_KEY: z.string().min(1, "STREAM_SECRET_KEY is required"),
});

export const env = envSchema.parse(process.env);
