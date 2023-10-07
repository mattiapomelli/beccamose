import { useEffect, useState } from "react";
import { useDerivedAccountEncryption } from "../crypto";
import { ILocationMessage } from "../types";
import { useMessages } from "./useMessages";

interface UseReceiveLocationParams {
  publicKey: `0x${string}`;
}

export const useReceiveLocation = ({ publicKey }: UseReceiveLocationParams) => {
  const { messages } = useMessages();
  const { decryptMessage } = useDerivedAccountEncryption();

  const [coords] = useState<{ latitude: number; longitude: number } | undefined>(undefined);

  // const [decryptedMessages, setDecryptedMessages] = useState<ILocationMessage[]>([]);

  useEffect(() => {
    const getDecryptedMessages = async () => {
      const decryptedMessages: ILocationMessage[] = [];

      // Decrypt all messages
      for (const message of messages) {
        const decryptedPayload = await decryptMessage(message.message);

        try {
          const parsedPayload = JSON.parse(decryptedPayload);
          decryptedMessages.push({
            ...message,
            message: parsedPayload,
          });
        } catch (error) {
          continue;
        }
      }
      console.log("Decrypted messages: ", decryptedMessages);

      // Get only messages of the current chat
      const filteredMessages = decryptedMessages.filter(
        message => message.message.senderPublicKey.toLowerCase() === publicKey.toLowerCase(),
      );

      // Get last message (most recent location)
      const lastMessage = filteredMessages[filteredMessages.length - 1];
      if (!lastMessage) return;

      const lastCoords = {
        latitude: lastMessage.message.lat,
        longitude: lastMessage.message.lng,
      };

      // setCoords(lastCoords);

      console.log("Last coords: ", lastCoords);
    };

    getDecryptedMessages();
  }, [messages, decryptMessage, publicKey]);

  // const lastMessage = filteredMessages[filteredMessages.length - 1];

  return {
    coords,
  };
};
