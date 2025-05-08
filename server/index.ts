import { db } from "@/database/connection";
import { auth } from "@/lib/auth";
import { and, eq, gt } from "drizzle-orm";
import { publicProcedure, router } from "@/lib/trpc";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";
import { workshopsTable } from "@/database/schema/workshop";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { z } from "zod";
import { user } from "@/database/schema/auth-schema";

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
        // country: "IN",
        email: userSession.user.email,
      });

      await db.insert(stripeConnectionsTable).values({
        userId: userSession.user.id,
        stripeAccountId: stripeAccount.id,
        onboardingCompleted: false,
      });

      const link = await stripe.accountLinks.create({
        account: stripeAccount.id,
        refresh_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard?stripeConnectRedirect=true`,
        type: "account_onboarding",
      });

      stripeAccountLink = link.url;
    } else {
      const link = await stripe.accountLinks.create({
        account: stripeConnectionId[0].stripeAccountId,
        refresh_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard?stripeConnectRedirect=true`,
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

  createWorkshop: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.number().min(1, "Price is required"),
        // TODO: this feels a flaky way, check later if this causes
        // some stupid funny issues like before
        time: z.number().min(Math.floor(Date.now() / 1000), "Time is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { name, description, price, time } = input;

      const updatedPrice = price * 100;

      const userSession = await auth.api.getSession({
        headers: await headers(),
      });

      if (!userSession)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be signed in to access this endpoint.",
        });

      // Check if Stripe connection exists
      const stripeConnectionId = await db
        .select()
        .from(stripeConnectionsTable)
        .where(
          and(
            eq(stripeConnectionsTable.userId, userSession.user.id),
            eq(stripeConnectionsTable.onboardingCompleted, true)
          )
        );

      if (!stripeConnectionId[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You need to connect your Stripe account to create a workshop.",
        });
      }

      // console.log(name, description, price, time);

      await db.insert(workshopsTable).values({
        name: name,
        description: description,
        price: updatedPrice,
        time: time,
        createdBy: userSession.user.id,
      });

      return {
        success: true,
        message: "Workshop created successfully",
      };
    }),

  getStripeUpdateLink: publicProcedure.query(async ({}) => {
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
      .where(
        and(
          eq(stripeConnectionsTable.userId, userSession.user.id),
          eq(stripeConnectionsTable.onboardingCompleted, true)
        )
      );

    if (!stripeConnectionId[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Please complete Stripe onboarding before updating your account.",
      });
    }

    const link = await stripe.accountLinks.create({
      account: stripeConnectionId[0].stripeAccountId,
      type: "account_update",
      refresh_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      return_url: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return link.url;
  }),

  // Shop section
  getShopDetails: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const userDetails = await db.select().from(user).where(eq(user.id, id));

      const owner = {
        name: userDetails[0].name,
        image: userDetails[0].image,
        email: userDetails[0].email,
      };

      if (userDetails.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shop not found!",
        });
      }

      return owner;
    }),

  getWorkshopsById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const workshops = await db
        .select()
        .from(workshopsTable)
        .where(
          and(
            eq(workshopsTable.createdBy, id),
            gt(workshopsTable.time, Math.floor(Date.now() / 1000))
          )
        );

      return workshops;
    }),
});

export type AppRouter = typeof appRouter;
