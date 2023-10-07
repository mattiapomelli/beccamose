import { LocationMessage } from "../constants";
import { useConnectedPeers } from "./useConnectedPeers";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useLightPush, useWaku } from "@waku/react";

export const useSendMessage = () => {
  const { node, isLoading } = useWaku<LightNode>();
  const { encoder } = useContentPair();
  const { push } = useLightPush({ node, encoder });

  const { lightPushPeers } = useConnectedPeers();

  const sendMessage = async (message: string) => {
    if (!push || lightPushPeers?.length === 0 || !node || isLoading) return;

    console.log(">>> Sending message");

    const timestamp = new Date();
    // Create a new message object
    const protoMessage = LocationMessage.create({
      timestamp: Date.now(),
      sender: node?.libp2p.peerId.toString(),
      message,
      nonce: Math.floor(Math.random() * 1000000000000),
    });
    // Serialise the message using Protobuf
    const payload = LocationMessage.encode(protoMessage).finish();

    const res = await push({ payload, timestamp });

    return res;
  };

  return {
    sendMessage,
  };
};
