import { LightNode } from "@waku/interfaces";
import { useContentPair, useFilterMessages, useWaku } from "@waku/react";
import { ILocationMessage, LocationMessage } from "~~/constants/waku";

export const useMessages = () => {
  const { node } = useWaku<LightNode>();
  const { decoder } = useContentPair();

  const { messages: decodedMessages } = useFilterMessages({
    node,
    decoder,
    // options: {
    //   pageSize: 5,
    //   pageDirection: PageDirection.FORWARD,
    //   timeFilter: {
    //     startTime: new Date().setTime(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    //     endTime: new Date(),
    //   },
    // },
  });

  const messages = decodedMessages.map(message =>
    LocationMessage.decode(message.payload).toJSON(),
  ) as ILocationMessage[];

  return {
    messages,
  };
};