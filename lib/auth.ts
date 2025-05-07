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
import { stripe } from "@better-auth/stripe";
import { stripe as stripeClient } from "@/lib/stripe";
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
  plugins: [
    nextCookies(),
    openAPI(),
    stripe({
      stripeClient,
      createCustomerOnSignUp: true,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      onEvent: async (event) => {
        console.log("[onEvent]", event.type);
        if (event.type === "account.application.authorized") {
          console.log(
            "[account.application.authorized] account",
            event.account
          );
          console.log("[account.application.authorized]", event.data.object);
        }
      },
    }),
  ],
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
