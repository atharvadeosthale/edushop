import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import DashboardClient from "./client";
import { unauthorized } from "next/navigation";
import { db } from "@/database/connection";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";
import { eq } from "drizzle-orm";
import { getQueryClient, trpc } from "@/lib/trpc/server";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getStripeConnection.queryOptions());

  return <DashboardClient />;
}
