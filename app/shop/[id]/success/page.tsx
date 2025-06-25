import { db } from "@/database/connection";
import { purchasesTable } from "@/database/schema/purchase";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function SuccessPage({
  searchParams,
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const checkoutSessionId = (await searchParams).checkout_session_id as string;

  if (!checkoutSessionId) {
    return redirect(`${env.NEXT_PUBLIC_BASE_URL}/shop/${id}`);
  }

  // Get the stripe customer id from the checkout session
  const stripeConnection = await db
    .select()
    .from(stripeConnectionsTable)
    .where(eq(stripeConnectionsTable.userId, id));

  if (stripeConnection.length < 1) {
    return redirect(`${env.NEXT_PUBLIC_BASE_URL}/shop/${id}`);
  }

  const creatorStripeCustomerId = stripeConnection[0].stripeAccountId;

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    checkoutSessionId,
    {
      stripeAccount: creatorStripeCustomerId,
    }
  );

  if (checkoutSession.status !== "complete") {
    return redirect(`${env.NEXT_PUBLIC_BASE_URL}/shop/${id}`);
  }

  await db
    .update(purchasesTable)
    .set({
      purchaseSuccessful: true,
    })
    .where(eq(purchasesTable.stripeCheckoutId, checkoutSessionId));

  // Get the purchase
  const purchase = await db
    .select()
    .from(purchasesTable)
    .where(eq(purchasesTable.stripeCheckoutId, checkoutSessionId));

  return redirect(
    `${env.NEXT_PUBLIC_BASE_URL}/shop/${id}?showSuccess=true&workshopId=${purchase[0].workshopId}`
  );
}
