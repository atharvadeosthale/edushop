import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { db } from "@/database/connection";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";
import { eq } from "drizzle-orm";

const webhookSecret = env.STRIPE_CONNECT_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      // Then define and call a function to handle the event checkout.session.completed
      console.log("Checkout session completed:", session);
      break;
    case "capability.updated":
      console.log("Capability updated:", event.data.object);
      console.log("Event data:", event.data);

      const accountId = event.data.object.account.toString();
      const account = await stripe.accounts.retrieve(accountId);

      // TODO: make this efficient later, for now just update capabilites as
      // you receive them from Stripe
      if (account.capabilities?.transfers) {
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
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
      console.log("Event data:", event.data);
  }

  return NextResponse.json({ received: true });
}
