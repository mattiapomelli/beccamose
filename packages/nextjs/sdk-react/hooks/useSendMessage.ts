import { LocationMessage } from "../constants";
import { useConnectedPeers } from "./useConnectedPeers";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useLightPush, useWaku } from "@waku/react";
import { useAccount } from "wagmi";

export const useSendMessage = () => {
  const { address } = useAccount();
  const { node, isLoading } = useWaku<LightNode>();
  const { encoder } = useContentPair();
  const { push } = useLightPush({ node, encoder });

  const { lightPushPeers } = useConnectedPeers();

  const sendMessage = async (message: string) => {
    if (!push || lightPushPeers?.length === 0 || !node || isLoading) return;

    console.log(">>> Sending message: ", JSON.parse(message));

    const timestamp = new Date();
    const protoMessage = LocationMessage.create({
      timestamp: Date.now(),
      // sender: node?.libp2p.peerId.toString(),
      sender: address?.toLowerCase(), // TODO: move sender inside the encrypted message
      message,
      nonce: Math.floor(Math.random() * 1000000000000),
    });
    // Serialise the message using Protobuf
    const payload = LocationMessage.encode(protoMessage).finish();

    try {
      const res = await push({ payload, timestamp });

      if (!res.errors) {
        console.log(">>> Message sent");
      }

      return res;
    } catch (error) {
      console.log(">>> Error sending message: ", error);

      return null;
    }
  };

  return {
    sendMessage,
  };
};
