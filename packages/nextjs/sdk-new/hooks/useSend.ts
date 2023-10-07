import { CONTENT_TOPIC, chatMessage } from "../constants";
import { useNode } from "./useNode";
import { createEncoder } from "@waku/sdk";

export const useSend = () => {
  const { data: node } = useNode();

  const send = async (message: string) => {
    if (!node) return;

    // Create a message encoder
    const encoder = createEncoder({ contentTopic: CONTENT_TOPIC });

    // Create a new message object
    const protoMessage = chatMessage.create({
      timestamp: Date.now(),
      sender: "Alice",
      message,
    });

    // Serialise the message using Protobuf
    const serialisedMessage = chatMessage.encode(protoMessage).finish();

    try {
      // Send the message using Light Push
      const res = await node.lightPush.send(encoder, {
        payload: serialisedMessage,
      });

      console.log("Res: ", res);
    } catch (error) {
      console.log("Error while sending");
    }
  };

  return {
    send,
  };
};
