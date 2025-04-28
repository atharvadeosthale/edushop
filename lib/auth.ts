import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/connection";
import {
  session,
  user,
  account,
  verification,
} from "@/database/schema/auth-schema";
import { openAPI } from "better-auth/plugins";
import { env } from "./env";

export const auth = betterAuth({
  appName: "edushop",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  plugins: [nextCookies(), openAPI()],
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 minutes in seconds
    },
  },
});
