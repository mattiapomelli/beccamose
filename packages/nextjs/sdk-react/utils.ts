import { LocationMessage } from "./constants";
import { ILocationMessage } from "./types";
import { IDecodedMessage } from "@waku/interfaces";

export const decodeMessage = (message: IDecodedMessage) => {
  const json = LocationMessage.decode(message.payload).toJSON();
  return {
    ...json,
    message: JSON.parse(json.message),
  };
};

export const decodeMessages = (messages: IDecodedMessage[]) => {
  return messages.map(decodeMessage) as ILocationMessage[];
};
