import { decodeMessages } from "../utils";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useFilterMessages, useWaku } from "@waku/react";
import { useAccount } from "wagmi";

export const useMessages = () => {
  const { address } = useAccount();
  const { node } = useWaku<LightNode>();
  const { decoder } = useContentPair();

  const { messages, ...rest } = useFilterMessages({
    node,
    decoder,
  });

  // Decode messages
  const decodedMessages = decodeMessages(messages);
  console.log("Messages: ", decodedMessages);

  // Get messages that were not sent by the current user
  const filteredMessages = decodedMessages.filter(message => address?.toLowerCase() !== message.sender.toLowerCase());
  console.log("Other messages: ", filteredMessages);

  return {
    messages: filteredMessages,
    ...rest,
  };
};
