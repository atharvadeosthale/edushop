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

export default function WorkshopClientPage({
  streamUserToken,
  callId,
}: {
  streamUserToken: string;
  callId: string;
}) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.getUser.queryOptions());
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if (!user) return;

    const videoClient = StreamVideoClient.getOrCreateInstance({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      token: streamUserToken,
      user: {
        id: user.id,
        name: user.name,
        image: user.image ?? undefined,
      },
    });

    const callInstance = videoClient.call("livestream", callId);
    callInstance.join({ create: true });

    setClient(videoClient);
    setCall(callInstance);

    return () => {
      // Clean up
      callInstance.leave();
    };
  }, [user, streamUserToken, callId]);

  if (!user || !client || !call) {
    return <div>Loading...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <WorkshopUILayout />
      </StreamCall>
    </StreamVideo>
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
