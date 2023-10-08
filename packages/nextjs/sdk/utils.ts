import { locationMessage } from "./constants";
import { ILocationMessage } from "./types";
import { IDecodedMessage } from "@waku/interfaces";

export const decodeMessage = (message: IDecodedMessage) => {
  try {
    const json = locationMessage.decode(message.payload).toJSON();
    return {
      ...json,
      message: JSON.parse(json.message),
    };
  } catch (error) {
    return null;
  }
};

export const decodeMessages = (messages: IDecodedMessage[]) => {
  return messages.map(decodeMessage).filter(m => m !== null) as ILocationMessage[];
};
