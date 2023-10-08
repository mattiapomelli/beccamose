import { useEffect } from "react";
import { CONTENT_TOPIC, locationMessage } from "../constants";
import { useNode } from "./useNode";
import { DecodedMessage, createDecoder } from "@waku/sdk";
import { useDerivedAccountEncryption } from "~~/sdk/crypto";

export const useReceive = () => {
  const { data: node } = useNode();
  const { decryptMessage } = useDerivedAccountEncryption();

  useEffect(() => {
    if (!node) return;

    const callback = async (wakuMessage: DecodedMessage) => {
      // Check if there is a payload on the message
      if (!wakuMessage.payload) return;

      // Render the messageObj as desired in your application
      const decodedMessage = locationMessage.decode(wakuMessage.payload).toJSON();
      console.log("Received message: ", decodedMessage);

      const decryptedMessageField = await decryptMessage(JSON.parse(decodedMessage.message));
      const parsedDecryptedMessageField = JSON.parse(decryptedMessageField);

      console.log("Decrypted message field: ", parsedDecryptedMessageField);
    };

    let unsubscribe: any;

    const subscribe = async () => {
      // Create a message and decoder
      const decoder = createDecoder(CONTENT_TOPIC);

      // Subscribe to content topics and display new messages
      await node.filter.subscribe([decoder], callback);
    };

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [node, decryptMessage]);
};
