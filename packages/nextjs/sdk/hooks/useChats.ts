import { ILocationChat } from "../types";
import { decodeMessages } from "../utils";
import { LightNode, PageDirection } from "@waku/interfaces";
import { useContentPair, useStoreMessages, useWaku } from "@waku/react";

export const useChats = () => {
  const { node } = useWaku<LightNode>();
  const { decoder } = useContentPair();

  const { messages, ...rest } = useStoreMessages({
    node,
    decoder,
    options: {
      pageSize: 10,
      pageDirection: PageDirection.FORWARD,
      timeFilter: {
        startTime: new Date(Date.now() - 1000 * 60 * 20), // 10 minutes ago
        endTime: new Date(),
      },
    },
  });

  const decodedMessages = decodeMessages(messages);

  console.log("Decoded messages: ", decodedMessages);

  // Get last messages with unique senders
  const chats: ILocationChat[] = [];
  decodedMessages.forEach(message => {
    const index = chats.findIndex(lastMessage => lastMessage.sender.toLowerCase() === message.sender.toLowerCase());
    if (index === -1) {
      chats.push({
        sender: message.sender,
        timestamp: message.timestamp,
      });
    } else {
      chats[index] = {
        sender: message.sender,
        timestamp: message.timestamp,
      };
    }
  });

  return {
    chats,
    ...rest,
  };
};
