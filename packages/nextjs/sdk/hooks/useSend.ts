import { useNode } from "./useNode";
import { createEncoder } from "@waku/sdk";
import protobuf from "protobufjs";

// Choose a content topic
const contentTopic = "/light-guide/1/message/proto";

export const useSend = () => {
  const { data: node } = useNode();

  const send = async (message: string) => {
    if (!node) return;

    // Create a message encoder
    const encoder = createEncoder({ contentTopic });

    // Create a message structure using Protobuf
    const chatMessage = new protobuf.Type("ChatMessage")
      .add(new protobuf.Field("timestamp", 1, "uint64"))
      .add(new protobuf.Field("sender", 2, "string"))
      .add(new protobuf.Field("message", 3, "string"));

    // Create a new message object
    const protoMessage = chatMessage.create({
      timestamp: Date.now(),
      sender: "Alice",
      message,
    });

    // Serialise the message using Protobuf
    const serialisedMessage = chatMessage.encode(protoMessage).finish();

    // Send the message using Light Push
    const res = await node.lightPush.send(encoder, {
      payload: serialisedMessage,
    });

    console.log("Res: ", res);
  };

  return {
    send,
  };
};
