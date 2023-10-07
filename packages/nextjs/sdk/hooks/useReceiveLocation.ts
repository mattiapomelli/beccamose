import { useDerivedAccountEncryption } from "../crypto";
import { ILocationMessage } from "../types";
import { useMessages } from "./useMessages";
import { useQuery } from "@tanstack/react-query";

interface UseReceiveLocationParams {
  publicKey: `0x${string}`;
}

export const useReceiveLocation = ({ publicKey }: UseReceiveLocationParams) => {
  const { messages } = useMessages();
  const { decryptMessage } = useDerivedAccountEncryption();

  console.log("--- Received Messages: ", messages);

  const { data: coords } = useQuery({
    queryKey: [messages, publicKey],
    queryFn: async () => {
      const decryptedMessages: ILocationMessage[] = [];

      let failed = 0;

      console.log(`--- Starting messages decryption`);

      // Get last 10 messages
      const lastMessages = messages.slice(-10);

      // Decrypt all messages
      for (const message of lastMessages) {
        try {
          const decryptedPayload = await decryptMessage(message.message);
          const parsedPayload = JSON.parse(decryptedPayload);

          decryptedMessages.push({
            ...message,
            message: parsedPayload,
          });
        } catch (error) {
          failed++;

          // console.log("Error decrypting");
          continue;
        }
      }

      console.log(`--- Failed ${failed} decryptions out of ${lastMessages.length} messages`);
      console.log("--- Decrypted received messages: ", decryptedMessages);

      // Get only messages of the current chat
      const filteredMessages = decryptedMessages.filter(
        message => message.message.senderPublicKey.toLowerCase() === publicKey.toLowerCase(),
      );

      console.log("--- Decrypted received messages of this chat: ", filteredMessages);

      // Get last message (most recent location)
      const lastMessage = filteredMessages[filteredMessages.length - 1];
      if (!lastMessage) return { latitude: 0, longitude: 0 };

      const lastCoords = {
        latitude: lastMessage.message.lat,
        longitude: lastMessage.message.lng,
      };

      return lastCoords;
    },
  });

  // useEffect(() => {
  //   const getDecryptedMessages = async () => {
  //     const decryptedMessages: ILocationMessage[] = [];

  //     // Decrypt all messages
  //     for (const message of messages) {
  //       const decryptedPayload = await decryptMessage(message.message);

  //       try {
  //         const parsedPayload = JSON.parse(decryptedPayload);
  //         decryptedMessages.push({
  //           ...message,
  //           message: parsedPayload,
  //         });
  //       } catch (error) {
  //         continue;
  //       }
  //     }
  //     console.log("Decrypted messages: ", decryptedMessages);

  //     // Get only messages of the current chat
  //     const filteredMessages = decryptedMessages.filter(
  //       message => message.message.senderPublicKey.toLowerCase() === publicKey.toLowerCase(),
  //     );

  //     // Get last message (most recent location)
  //     const lastMessage = filteredMessages[filteredMessages.length - 1];
  //     if (!lastMessage) return;

  //     const lastCoords = {
  //       latitude: lastMessage.message.lat,
  //       longitude: lastMessage.message.lng,
  //     };

  //     // setCoords(lastCoords);

  //     console.log("Last coords: ", lastCoords);
  //   };

  //   getDecryptedMessages();
  // }, [messages, decryptMessage, publicKey]);

  // const lastMessage = filteredMessages[filteredMessages.length - 1];

  return {
    coords,
  };
};
