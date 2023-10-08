import { CONTENT_TOPIC, locationMessage } from "../constants";
import { useNode } from "./useNode";
import { useQuery } from "@tanstack/react-query";
import { PageDirection } from "@waku/core";
import { createDecoder } from "@waku/sdk";
import { useDerivedAccountEncryption } from "~~/sdk/crypto";

export interface ILocationChat {
  senderAddress: string;
  senderPublicKey: string;
  timestamp: Date;
}

export const useStoredChats = () => {
  const { data: node, isLoading } = useNode();
  const { decryptMessage } = useDerivedAccountEncryption();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["chats", isLoading],
    queryFn: async () => {
      console.log("Node: ", node);

      if (!node) return [];

      const decoder = createDecoder(CONTENT_TOPIC);

      // Create the store query
      const storeQuery = node.store.queryGenerator([decoder], {
        pageSize: 1000,
        pageDirection: PageDirection.FORWARD,
        timeFilter: {
          startTime: new Date(Date.now() - 1000 * 60 * 2), // 10 minutes ago
          endTime: new Date(),
        },
      });

      const allMessages = [];

      // Process the messages
      for await (const messagesPromises of storeQuery) {
        console.log("Message promises", messagesPromises);

        // const messagesRaw = await Promise.all(messagesPromises);

        // Fulfil the messages promises
        const messages = await Promise.all(
          messagesPromises.slice(-10).map(async p => {
            const message = await p;
            if (!message) return null;
            const decodedMessage = locationMessage.decode(message.payload).toJSON();
            const decryptedMessageField = await decryptMessage(JSON.parse(decodedMessage.message));
            const parsedDecryptedMessageField = JSON.parse(decryptedMessageField);

            return {
              ...decodedMessage,
              message: parsedDecryptedMessageField,
            };
          }),
        );

        allMessages.push(...messages);
      }

      console.log("All messages: ", allMessages);

      const filteredMessages = allMessages.filter(m => m !== null);

      // Get last messages with unique senders
      const chats: ILocationChat[] = [];

      filteredMessages.forEach((message: any) => {
        const index = chats.findIndex(chat => chat.senderPublicKey.toLowerCase() === message.message.senderPublicKey);
        if (index === -1) {
          chats.push({
            senderAddress: message?.message.senderAddress,
            senderPublicKey: message?.message.senderPublicKey,
            timestamp: message?.timestamp,
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
    enabled: !!node,
  });
};
