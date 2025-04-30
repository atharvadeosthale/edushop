import { db } from "@/database/connection";
import { user } from "@/database/schema/auth-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "@/lib/trpc";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";

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

    return stripeConnectionId[0]?.stripeAccountId ?? null;
  }),
});

export type AppRouter = typeof appRouter;
