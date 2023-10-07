import { useMessages } from "./useMessages";

export const useReceiveLocation = () => {
  const { messages } = useMessages();

  const lastMessage = messages[messages.length - 1];

  return {
    coords: lastMessage
      ? {
          latitude: lastMessage.message.lat,
          longitude: lastMessage.message.lng,
        }
      : undefined,
  };
};
