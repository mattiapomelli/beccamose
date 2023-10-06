import { LocationMessage } from "../constants";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useLightPush, useWaku } from "@waku/react";

export const useSendMessage = () => {
  const { node } = useWaku<LightNode>();
  const { encoder } = useContentPair();
  const { push: onPush } = useLightPush({ node, encoder });

  const sendMessage = async (message: string) => {
    console.log("Sending message");

    if (!onPush) return;

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

    const res = await onPush({ payload, timestamp });

    return res;
  };

  return {
    sendMessage,
  };
};
