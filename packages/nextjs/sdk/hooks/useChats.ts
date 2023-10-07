import { useMemo } from "react";
import { useDerivedAccountEncryption } from "../crypto";
import { ILocationChat, ILocationMessage } from "../types";
import { decodeMessages } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { LightNode, PageDirection } from "@waku/interfaces";
import { useContentPair, useStoreMessages, useWaku } from "@waku/react";

export const useChats = () => {
  const { node } = useWaku<LightNode>();
  const { decoder } = useContentPair();
  const { decryptMessage, derivedAccountReady } = useDerivedAccountEncryption();

  const { messages, ...rest } = useStoreMessages({
    node,
    decoder,
    options: {
      pageSize: 1000,
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

      const decryptedMessages = (await Promise.all(decryptedPromises).then(results =>
        results.filter(result => result !== null),
      )) as ILocationMessage[];

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

      // console.log("Chats: ", chats);

      // const lastCoords = {
      //   latitude: lastMessage.message.lat,
      //   longitude: lastMessage.message.lng,
      // };

      // return lastCoords;

      return chats;
    },
    enabled: derivedAccountReady,
  });

  // // Get last messages with unique senders
  // const chats: ILocationChat[] = [];

  // decodedMessages.forEach(message => {
  //   const index = chats.findIndex(lastMessage => lastMessage.sender.toLowerCase() === message.sender.toLowerCase());
  //   if (index === -1) {
  //     chats.push({
  //       sender: message.sender,
  //       timestamp: message.timestamp,
  //     });
  //   } else {
  //     chats[index] = {
  //       sender: message.sender,
  //       timestamp: message.timestamp,
  //     };
  //   }
  // });

  return {
    chats,
    ...rest,
  };
};
