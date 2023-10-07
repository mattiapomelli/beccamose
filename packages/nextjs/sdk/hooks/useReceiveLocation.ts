import { useMessages } from "./useMessages";

interface UseReceiveLocationParams {
  address: string;
}

export const useReceiveLocation = ({ address }: UseReceiveLocationParams) => {
  const { messages } = useMessages();

  // Get messages that were sent by the given address
  const filteredMessages = messages.filter(message => address.toLowerCase() === message.sender.toLowerCase());
  // console.log("Filtered messages: ", filteredMessages);

  const lastMessage = filteredMessages[filteredMessages.length - 1];

  return {
    coords: lastMessage
      ? {
          latitude: lastMessage.message.lat,
          longitude: lastMessage.message.lng,
        }
      : undefined,
  };
};
