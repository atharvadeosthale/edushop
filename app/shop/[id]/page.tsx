import { getQueryClient, trpc } from "@/lib/trpc/server";
import { ShopClientPage } from "./client";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { showSuccess, workshopId } = await searchParams;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.getShopDetails.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShopClientPage
        id={id}
        showSuccess={showSuccess as string}
        purchaseWorkshopId={workshopId as string}
      />
    </HydrationBoundary>
  );
}
