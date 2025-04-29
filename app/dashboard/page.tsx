import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import DashboardClient from "./client";
import { unauthorized } from "next/navigation";
import { db } from "@/database/connection";
import { stripeConnectionsTable } from "@/database/schema/stripe-connection";
import { eq } from "drizzle-orm";

export default async function Page() {
  const user = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!user.data?.user) {
    unauthorized();
  }

  const stripeConnectedAccountId = await db
    .select()
    .from(stripeConnectionsTable)
    .where(eq(stripeConnectionsTable.userId, user.data.user.id));

  const data = {
    user: user.data.user,
    stripeConnectedAccountId: stripeConnectedAccountId[0]?.stripeAccountId,
  };

  return <DashboardClient data={data} />;
}
