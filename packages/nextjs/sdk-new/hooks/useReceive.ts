import { useEffect } from "react";
import { CONTENT_TOPIC, chatMessage } from "../constants";
import { useNode } from "./useNode";
import { DecodedMessage, createDecoder } from "@waku/sdk";

export const useReceive = () => {
  const { data: node } = useNode();

  useEffect(() => {
    if (!node) return;

    const callback = (wakuMessage: DecodedMessage) => {
      console.log("Received message: ", wakuMessage);

      // Check if there is a payload on the message
      if (!wakuMessage.payload) return;

      // Render the messageObj as desired in your application
      const messageObj = chatMessage.decode(wakuMessage.payload);
      console.log(messageObj);
    };

    let unsubscribe: any;

    const subscribe = async () => {
      // Create a message and decoder
      const decoder = createDecoder(CONTENT_TOPIC);

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
