import { nextCookies } from "better-auth/next-js";
import { StreamClient } from "@stream-io/node-sdk";
import type { UserRequest } from "@stream-io/node-sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/connection";
import {
  session,
  user,
  account,
  verification,
} from "@/database/schema/auth-schema";
import { createAuthMiddleware, openAPI } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe";
import { stripe as stripeClient } from "@/lib/stripe";
import { env } from "./env";
import Stripe from "stripe";
import { purchasesTable } from "@/database/schema/purchase";
import { eq } from "drizzle-orm";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";

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
      stripeWebhookSecret: env.STRIPE_CONNECT_WEBHOOK_SECRET,
      onEvent: async (event) => {
        console.log("[onEvent]", event.type);

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;

          console.log("Checkout session completed:", session);

          const checkoutSession = await stripeClient.checkout.sessions.retrieve(
            session.id,
            { stripeAccount: event.account }
          );

          console.log("Checkout session:", checkoutSession);

          if (checkoutSession.status === "complete") {
            // Purchase successful, update the DB
            await db
              .update(purchasesTable)
              .set({
                purchaseSuccessful: true,
              })
              .where(eq(purchasesTable.stripeCheckoutId, checkoutSession.id));
          }
        }

        if (event.type === "capability.updated") {
          const accountId = event.data.object.account.toString();
          const account = await stripeClient.accounts.retrieve(accountId);

          if (
            account.capabilities?.transfers === "active" &&
            account.capabilities?.card_payments === "active"
          ) {
            await db
              .update(stripeConnectionsTable)
              .set({
                onboardingCompleted: true,
              })
              .where(eq(stripeConnectionsTable.stripeAccountId, accountId));
          } else {
            await db
              .update(stripeConnectionsTable)
              .set({
                onboardingCompleted: false,
              })
              .where(eq(stripeConnectionsTable.stripeAccountId, accountId));
          }
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

  // Hooks
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (
        !ctx.path.startsWith("/sign-up") &&
        !ctx.path.startsWith("/sign-in") &&
        !ctx.path.startsWith("/callback")
      )
        return;

      const newSession = ctx.context.newSession;
      const user = newSession?.user;
      if (!user) return;

      const streamClient = new StreamClient(
        env.NEXT_PUBLIC_STREAM_API_KEY,
        env.STREAM_SECRET_KEY
      );

      const streamUser: UserRequest = {
        id: user.id,
        name: user.name,
        image: user.image ?? undefined,
      };

      await streamClient.upsertUsers([streamUser]);
    }),
  },
});
