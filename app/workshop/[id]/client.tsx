"use client";

import { useTRPC } from "@/lib/trpc/client";
import {
  SpeakerLayout,
  CallControls,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  CallingState,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  Window,
  Chat,
  MessageList,
  useCreateChatClient,
  Thread,
} from "stream-chat-react";
import { Channel as ChannelType } from "stream-chat";

export default function WorkshopClientPage({
  streamUserToken,
  callId,
  streamChatUserToken,
}: {
  streamUserToken: string;
  callId: string;
  streamChatUserToken: string;
}) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.getUser.queryOptions());
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [channel, setChannel] = useState<ChannelType | undefined>(undefined);

  const chatClient = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: streamChatUserToken,
    userData: {
      id: user?.id || "",
      name: user?.name,
      image: user?.image ?? undefined,
    },
  });

  const handleConnections = async () => {
    if (!user || !chatClient) return;

    const videoClient = StreamVideoClient.getOrCreateInstance({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      token: streamUserToken,
      user: {
        id: user.id,
        name: user.name,
        image: user.image ?? undefined,
      },
    });

    const callInstance = videoClient.call("default", callId);
    callInstance.join({ create: true });

    setClient(videoClient);
    setCall(callInstance);

    await chatClient.connectUser(
      { id: user.id, name: user.name, image: user.image ?? undefined },
      streamChatUserToken
    );

    const channel = chatClient.channel("messaging", callId, {
      members: [user.id],
    });

    setChannel(channel);
  };

  useEffect(() => {
    if (channel) return;
    handleConnections();

    return () => {
      // Clean up
      call?.leave();
    };
  }, [user, streamUserToken, callId, chatClient]);

  if (!user || !client || !call || !chatClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <WorkshopUILayout />
          </StreamCall>
        </StreamVideo>
      </div>
      <div className="w-96 h-full">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
}

const WorkshopUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600">Joining workshop...</p>
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="str-video mt-10">
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls onLeave={() => (window.location.href = "/")} />
      </div>
    </StreamTheme>
  );
};
