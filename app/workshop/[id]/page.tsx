import { auth } from "@/lib/auth";
import { caller, getQueryClient, trpc } from "@/lib/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, unauthorized } from "next/navigation";
import WorkshopClientPage from "./client";
import { TRPCError } from "@trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    unauthorized();
  }

  const queryClient = getQueryClient();

  let workshop;

  try {
    workshop = await caller.getWorkshopById({ id: parseInt(id) });
  } catch (err) {
    if (err instanceof TRPCError && err.code === "NOT_FOUND") {
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkshopClientPage />
    </HydrationBoundary>
  );
}
