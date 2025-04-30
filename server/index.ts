import { db } from "@/database/connection";
import { user } from "@/database/schema/auth-schema";
import { auth } from "@/lib/auth";
import { and, eq, gt } from "drizzle-orm";
import { publicProcedure, router } from "@/lib/trpc";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";
import { workshopsTable } from "@/database/schema/workshop";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export const appRouter = router({
  getUser: publicProcedure.query(async ({}) => {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be signed in to access this endpoint.",
      });

    return userSession.user;
  }),

  getStripeConnection: publicProcedure.query(async ({}) => {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be signed in to access this endpoint.",
      });

    const stripeConnectionId = await db
      .select()
      .from(stripeConnectionsTable)
      .where(eq(stripeConnectionsTable.userId, userSession.user.id));

    if (!stripeConnectionId[0]) {
      return null;
    }

    if (!stripeConnectionId[0].onboardingCompleted) {
      return null;
    }

    return stripeConnectionId[0].stripeAccountId;
  }),

  createStripeConnection: publicProcedure.mutation(async ({}) => {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be signed in to access this endpoint.",
      });

    // Check if account already exists
    const stripeConnectionId = await db
      .select()
      .from(stripeConnectionsTable)
      .where(eq(stripeConnectionsTable.userId, userSession.user.id));

    if (stripeConnectionId[0] && stripeConnectionId[0].onboardingCompleted) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You already have a Stripe account connected.",
      });
    }

    let stripeAccountLink: string;

    if (!stripeConnectionId[0]) {
      const stripeAccount = await stripe.accounts.create({
        type: "express",
        country: "IN",
        email: userSession.user.email,
        individual: {
          full_name_aliases: [userSession.user.name],
        },
      });

      await db.insert(stripeConnectionsTable).values({
        userId: userSession.user.id,
        stripeAccountId: stripeAccount.id,
        onboardingCompleted: false,
      });

      const link = await stripe.accountLinks.create({
        account: stripeAccount.id,
        refresh_url: `/dashboard`,
        return_url: `/dashboard`,
        type: "account_onboarding",
      });

      stripeAccountLink = link.url;
    } else {
      const link = await stripe.accountLinks.create({
        account: stripeConnectionId[0].stripeAccountId,
        refresh_url: `/dashboard`,
        return_url: `/dashboard`,
        type: "account_onboarding",
      });

      stripeAccountLink = link.url;
    }

    return stripeAccountLink;
  }),

  getWorkshops: publicProcedure.query(async ({}) => {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You need to be signed in to access this endpoint.",
      });

    const workshops = await db
      .select()
      .from(workshopsTable)
      .where(
        and(
          eq(workshopsTable.createdBy, userSession.user.id),
          gt(workshopsTable.time, Math.floor(Date.now() / 1000))
        )
      );

    return workshops;
  }),
});

export type AppRouter = typeof appRouter;
