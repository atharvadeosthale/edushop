import { getQueryClient, trpc } from "@/lib/trpc/server";
import { ShopClientPage } from "./client";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.getShopDetails.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShopClientPage id={id} />
    </HydrationBoundary>
  );
}
