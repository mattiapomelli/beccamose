import { useMemo } from "react";
import { CONTENT_TOPIC } from "../constants";
import { useDerivedAccountEncryption } from "../crypto";
import { ILocationChat, ILocationMessage } from "../types";
import { decodeMessages } from "../utils";
import { useNode } from "./useNode";
import { useQuery } from "@tanstack/react-query";
import { PageDirection } from "@waku/interfaces";
import { useStoreMessages } from "@waku/react";
import { createDecoder } from "@waku/sdk";

export const useChats = () => {
  const { data: node } = useNode();
  // Create a message and decoder
  const decoder = useMemo(() => createDecoder(CONTENT_TOPIC), []);

  const { decryptMessage, derivedAccountReady } = useDerivedAccountEncryption();

  const { messages, ...rest } = useStoreMessages({
    node,
    decoder,
    options: {
      pageSize: 100,
      pageDirection: PageDirection.FORWARD,
      timeFilter: {
        startTime: new Date(Date.now() - 1000 * 60 * 1), // 10 minutes ago
        endTime: new Date(),
      },
    },
  });

  // const decodedMessages = decodeMessages(messages);
  const decodedMessages = useMemo(() => decodeMessages(messages), [messages]);

  console.log("--- Decoded chat messages: ", decodedMessages);

  const { data: chats } = useQuery({
    queryKey: [decodedMessages],
    queryFn: async () => {
      // console.log("Decoded messages length:", decodedMessages.length);

      let failed = 0;

      // Get last 10 messages
      const lastMessages = decodedMessages.slice(-10);

      // Decrypt all messages
      console.log(`--- Starting chats decryption`);

      const decryptedPromises = lastMessages.map(async (message, index) => {
        console.log("Decrypting ", index);
        const decryptedPayload = await decryptMessage(message.message);

        try {
          const parsedPayload = JSON.parse(decryptedPayload);
          console.log("Successfull decrypt ", index);
          return {
            ...message,
            message: parsedPayload,
          };
        } catch (error) {
          console.log("Error decrypting", index);
          failed++;

          return null;
        }
      });

      const decryptedMessagesSettlement = await Promise.allSettled(decryptedPromises);
      const decryptedMessages = decryptedMessagesSettlement
        .map(result => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            return null;
          }
        })
        .filter(result => result !== null) as ILocationMessage[];

      console.log(`--- Failed ${failed} decryptions out of ${lastMessages.length} messages`);
      console.log("--- Decrypted chat messages:", decryptedMessages);

      // console.log("Decrypted messages: ", decryptedMessages);

      // Get last messages with unique senders
      const chats: ILocationChat[] = [];

      decryptedMessages.forEach(message => {
        const index = chats.findIndex(chat => chat.senderPublicKey.toLowerCase() === message.message.senderPublicKey);
        if (index === -1) {
          chats.push({
            senderAddress: message.message.senderAddress,
            senderPublicKey: message.message.senderPublicKey,
            timestamp: message.timestamp,
          });
        } else {
          chats[index] = {
            senderAddress: message.message.senderAddress,
            senderPublicKey: message.message.senderPublicKey,
            timestamp: message.timestamp,
          };
        }
      });

      return chats;
    },
    enabled: derivedAccountReady,
  });

  return {
    chats,
    ...rest,
  };
};
