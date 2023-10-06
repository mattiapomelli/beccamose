import { ILocationMessage, LocationMessage } from "../constants";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useFilterMessages, useWaku } from "@waku/react";

export const useMessages = () => {
  const { node } = useWaku<LightNode>();
  const { decoder } = useContentPair();

  const { messages: decodedMessages } = useFilterMessages({
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

  const messages = decodedMessages.map(message => {
    const json = LocationMessage.decode(message.payload).toJSON();
    return {
      ...json,
      message: JSON.parse(json.message),
    };
  }) as ILocationMessage[];

  console.log("Messages: ", messages);

  const filteredMessages = messages.filter(message => node?.libp2p.peerId.toString() !== message.sender);

  console.log("Filtered messages: ", filteredMessages);

  return {
    messages: filteredMessages,
  };
};
