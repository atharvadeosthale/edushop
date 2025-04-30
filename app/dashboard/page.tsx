import { auth } from "@/lib/auth";
import DashboardClient from "./client";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export default async function Page() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    unauthorized();
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.getStripeConnection.queryOptions());
  await queryClient.prefetchQuery(trpc.getUser.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
