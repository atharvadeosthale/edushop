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
import { purchasesTable } from "@/database/schema/purchase";
import { StreamClient } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";

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
        email: userSession.user.email,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
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

      // Create stripe product
      const stripeProduct = await stripe.products.create(
        {
          name: name,
          description: description,
          metadata: {
            type: "workshop",
            time: time,
          },
        },
        {
          stripeAccount: stripeConnectionId[0].stripeAccountId,
        }
      );

      // Create stripe price
      await stripe.prices.create(
        {
          product: stripeProduct.id,
          unit_amount: updatedPrice,
          currency: "usd",
        },
        {
          stripeAccount: stripeConnectionId[0].stripeAccountId,
        }
      );

      const workshop = await db
        .insert(workshopsTable)
        .values({
          name: name,
          description: description,
          price: updatedPrice,
          time: time,
          createdBy: userSession.user.id,
          stripeProductId: stripeProduct.id,
        })
        .returning();

      // TODO: Create stream channels
      const streamClient = new StreamClient(
        env.NEXT_PUBLIC_STREAM_API_KEY,
        env.STREAM_SECRET_KEY
      );

      const streamChatClient = StreamChat.getInstance(
        env.NEXT_PUBLIC_STREAM_API_KEY,
        env.STREAM_SECRET_KEY
      );

      // Create stream call

      const call = await streamClient.video.call(
        "default",
        workshop[0].id.toString()
      );

      await call.create({
        data: {
          members: [{ user_id: workshop[0].createdBy, role: "admin" }],
          created_by: { id: workshop[0].createdBy, role: "admin" },
        },
      });

      // Create stream chat

      const channel = streamChatClient.channel(
        "messaging",
        workshop[0].id.toString(),
        {
          members: [workshop[0].createdBy],
          created_by: { id: workshop[0].createdBy, role: "admin" },
        }
      );
      await channel.create();

      return {
        success: true,
        message: "Workshop created successfully",
      };
    }),

  getStripeLoginLink: publicProcedure.mutation(async ({}) => {
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

    const link = await stripe.accounts.createLoginLink(
      stripeConnectionId[0].stripeAccountId
    );

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

  purchaseWorkshop: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const userSession = await auth.api.getSession({
        headers: await headers(),
      });

      if (!userSession)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be signed in to access this endpoint.",
        });
      // Get shop details & check if it exists
      const workshopDetails = await db
        .select()
        .from(workshopsTable)
        // .leftJoin(user, eq(workshopsTable.createdBy, user.id))
        .where(eq(workshopsTable.id, id));

      if (workshopDetails.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shop not found!",
        });
      }

      if (workshopDetails.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shop not found!",
        });
      }

      const workshop = workshopDetails[0];

      // Check if shop's stripe connection is valid
      const stripeConnectionId = await db
        .select()
        .from(stripeConnectionsTable)
        .where(eq(stripeConnectionsTable.userId, workshop.createdBy));

      if (!stripeConnectionId[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shop's Stripe account is not connected.",
        });
      }

      if (!stripeConnectionId[0].onboardingCompleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shop's Stripe account is not onboarded.",
        });
      }
      // Check if workshop is already purchased
      const purchase = await db
        .select()
        .from(purchasesTable)
        .where(
          and(
            eq(purchasesTable.userId, userSession.user.id),
            eq(purchasesTable.workshopId, id),
            eq(purchasesTable.purchaseSuccessful, true)
          )
        );

      if (purchase.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already purchased this workshop.",
        });
      }

      // Get price id
      const price = await stripe.prices.list(
        {
          product: workshop.stripeProductId,
        },
        {
          stripeAccount: stripeConnectionId[0].stripeAccountId,
        }
      );

      const session = await stripe.checkout.sessions.create(
        {
          line_items: [
            {
              price: price.data[0].id,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${env.NEXT_PUBLIC_BASE_URL}/shop/${workshop.createdBy}/success?checkout_session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/shop/${workshop.createdBy}?purchaseFailed=true`,
          customer_email: userSession.user.email,
          payment_intent_data: {
            application_fee_amount: workshop.price * 0.2,
          },
        },
        {
          stripeAccount: stripeConnectionId[0].stripeAccountId,
        }
      );

      // Entry in DB, later to be flagged true
      await db.insert(purchasesTable).values({
        userId: userSession.user.id,
        workshopId: id,
        stripeCheckoutId: session.id,
      });

      return session.url;
    }),

  getWorkshopById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { id } = input;

      const workshop = await db
        .select()
        .from(workshopsTable)
        .where(eq(workshopsTable.id, id));

      if (workshop.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workshop not found!",
        });
      }

      return workshop[0];
    }),

  checkWorkshopAuthorisation: publicProcedure
    .input(z.object({ workshopId: z.number() }))
    .query(async ({ input }) => {
      const { workshopId } = input;

      const userSession = await auth.api.getSession({
        headers: await headers(),
      });

      if (!userSession)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be signed in to access this endpoint.",
        });

      const workshop = await db
        .select()
        .from(workshopsTable)
        .where(eq(workshopsTable.id, workshopId));

      if (!workshop[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workshop not found!",
        });
      }

      if (workshop[0].createdBy === userSession.user.id) return true;

      const authorisedUser = await db
        .select()
        .from(purchasesTable)
        .where(
          and(
            eq(purchasesTable.userId, userSession.user.id),
            eq(purchasesTable.workshopId, workshopId),
            eq(purchasesTable.purchaseSuccessful, true)
          )
        );

      return authorisedUser.length > 0;
    }),
});

export type AppRouter = typeof appRouter;
