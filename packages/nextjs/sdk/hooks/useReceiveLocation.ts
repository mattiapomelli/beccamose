import { useMessages } from "./useMessages";

export const useReceiveLocation = () => {
  const { messages } = useMessages();

  const lastMessage = messages[messages.length - 1];

  return {
    coords: lastMessage
      ? {
          lat: lastMessage.message.lat,
          lng: lastMessage.message.lng,
        }
      : undefined,
  };
};
