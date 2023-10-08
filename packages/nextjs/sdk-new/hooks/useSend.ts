import { CONTENT_TOPIC, locationMessage } from "../constants";
import { useNode } from "./useNode";
import { createEncoder } from "@waku/sdk";

export const useSend = () => {
  const { data: node } = useNode();

  const send = async ({ message, sender }: { message: string; sender: string }) => {
    if (!node) return;

    // Create a message encoder
    const encoder = createEncoder({ contentTopic: CONTENT_TOPIC });

    // Create a new message object
    const protoMessage = locationMessage.create({
      timestamp: Date.now(),
      sender,
      message,
    });

    // Serialise the message using Protobuf
    const serialisedMessage = locationMessage.encode(protoMessage).finish();

    try {
      console.log("Sending message");

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
