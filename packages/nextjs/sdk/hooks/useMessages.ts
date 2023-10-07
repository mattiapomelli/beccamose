import { decodeMessages } from "../utils";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useFilterMessages, useWaku } from "@waku/react";

export const useMessages = () => {
  const { node } = useWaku<LightNode>();
  const { decoder } = useContentPair();

  const { messages, ...rest } = useFilterMessages({
    node,
    decoder,
    // @ts-ignore
    // options: {
    //   pageSize: 5,
    //   pageDirection: PageDirection.FORWARD,
    //   timeFilter: {
    //     startTime: new Date().setTime(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    //     endTime: new Date(),
    //   },
    // },
  });

  // console.log("Decoded messages: ", decodedMessages);

  const decodedMessages = decodeMessages(messages);

  console.log("Messages: ", decodedMessages);

  const filteredMessages = decodedMessages.filter(message => node?.libp2p.peerId.toString() !== message.sender);

  console.log("Other messages: ", filteredMessages);

  return {
    messages: filteredMessages,
    ...rest,
  };
};
