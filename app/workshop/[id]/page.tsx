import { auth } from "@/lib/auth";
import { caller, getQueryClient, trpc } from "@/lib/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, unauthorized } from "next/navigation";
import { StreamChatClient, StreamClient } from "@stream-io/node-sdk";
import WorkshopClientPage from "./client";
import { env } from "@/lib/env";
import { StreamChat } from "stream-chat";

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

  // Prefetch user details for client side
  await queryClient.prefetchQuery(trpc.getUser.queryOptions());

  // Prefetch workshop details also for use in server component
  const queryOptions = trpc.getWorkshopById.queryOptions({
    id: parseInt(id),
  });

  await queryClient.prefetchQuery(queryOptions);

  // Get data using the same query key that was used for prefetching
  const workshop = queryClient.getQueryData<
    Awaited<ReturnType<typeof caller.getWorkshopById>>
  >(queryOptions.queryKey);

  if (!workshop) {
    notFound();
  }

  // Check if user is authorised for this workshop
  const isAuthorised = await caller.checkWorkshopAuthorisation({
    workshopId: parseInt(id),
  });

  if (!isAuthorised) {
    unauthorized();
  }

  // Generate user token
  const streamClient = new StreamClient(
    env.NEXT_PUBLIC_STREAM_API_KEY,
    env.STREAM_SECRET_KEY
  );

  const streamChatClient = StreamChat.getInstance(
    env.NEXT_PUBLIC_STREAM_API_KEY,
    env.STREAM_SECRET_KEY
  );

  const chatChannel = await streamChatClient.channel("messaging", id, {
    members: [workshop.createdBy],
    created_by_id: workshop.createdBy,
  });

  await chatChannel.addMembers([user.user.id]);

  const streamChatUserToken = streamChatClient.createToken(user.user.id);

  const streamUserToken = streamClient.generateUserToken({
    user_id: user.user.id,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkshopClientPage
        streamUserToken={streamUserToken}
        callId={id}
        streamChatUserToken={streamChatUserToken}
      />
    </HydrationBoundary>
  );
}
