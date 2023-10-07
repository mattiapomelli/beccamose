import { useEffect } from "react";
import { useNode } from "./useNode";
import { DecodedMessage, createDecoder } from "@waku/sdk";
import protobuf from "protobufjs";

const contentTopic = "/light-guide/1/message/proto";

export const useReceive = () => {
  const { data: node } = useNode();

  useEffect(() => {
    if (!node) return;

    const callback = (wakuMessage: DecodedMessage) => {
      console.log("Received message: ", wakuMessage);

      // Check if there is a payload on the message
      if (!wakuMessage.payload) return;

      // Create a message structure using Protobuf
      const chatMessage = new protobuf.Type("ChatMessage")
        .add(new protobuf.Field("timestamp", 1, "uint64"))
        .add(new protobuf.Field("sender", 2, "string"))
        .add(new protobuf.Field("message", 3, "string"));

      // Render the messageObj as desired in your application
      const messageObj = chatMessage.decode(wakuMessage.payload);
      console.log(messageObj);
    };

    let unsubscribe: any;

    const subscribe = async () => {
      // Create a message and decoder
      const decoder = createDecoder(contentTopic);

      console.log("Node: ", node);

      // Subscribe to content topics and display new messages
      await node.filter.subscribe([decoder], callback);
    };

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [node]);
};
