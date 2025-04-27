import { z } from "zod";

const envSchema = z.object({
  // Database
  LIBSQL_TOKEN: z.string().min(1, "LIBSQL_TOKEN is required"),
  LIBSQL_URL: z.string().min(1, "LIBSQL_URL is required"),

  // Payments
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
});

export const env = envSchema.parse(process.env);
