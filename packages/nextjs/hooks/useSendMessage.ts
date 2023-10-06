import { LightNode } from "@waku/interfaces";
import { useContentPair, useLightPush, useWaku } from "@waku/react";
import { LocationMessage } from "~~/constants/waku";

export const useSendMessage = () => {
  const { node } = useWaku<LightNode>();
  const { encoder } = useContentPair();
  const { push: onPush } = useLightPush({ node, encoder });

  const sendMessage = async () => {
    if (!onPush) return;

    const timestamp = new Date();
    // Create a new message object
    const protoMessage = LocationMessage.create({
      timestamp: Date.now(),
      sender: "Alice",
      message: "Beccamose!",
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
