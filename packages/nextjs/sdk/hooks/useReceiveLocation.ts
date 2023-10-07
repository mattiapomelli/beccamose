import { useEffect } from "react";
import { useDerivedAccountEncryption } from "../crypto";
import { useMessages } from "./useMessages";

interface UseReceiveLocationParams {
  address: string;
}

export const useReceiveLocation = ({ address }: UseReceiveLocationParams) => {
  const { messages } = useMessages();
  const { decryptMessage } = useDerivedAccountEncryption();

  useEffect(() => {
    const getDecryptedMessages = async () => {
      const decryptedMessages = await Promise.all(
        messages.map(async message => ({
          ...message,
          // @ts-ignore
          message: await decryptMessage(message.message),
        })),
      );

      console.log("Decrypted messages: ", decryptedMessages);
    };

    getDecryptedMessages();
  }, [messages, decryptMessage]);

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
