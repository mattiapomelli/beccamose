import { useEffect, useState } from "react";
import { useSend } from "./useSend";
import { useGeolocated } from "react-geolocated";
import { useAccount } from "wagmi";
import { generateEncryptionClient } from "~~/sdk/crypto";

interface UseSendLocationParams {
  publicKey: `0x${string}`;
}

export const useSendLocation = ({ publicKey }: UseSendLocationParams) => {
  const { address } = useAccount();
  const [counter, setCounter] = useState(0);

  const { send } = useSend();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      // enableHighAccuracy: true,
    },
    // suppressLocationOnMount: true,
    userDecisionTimeout: 3000,
    watchPosition: true,
  });

  useEffect(() => {
    if (!address) return;

    const callback = async () => {
      const message = `${coords?.latitude} - ${coords?.longitude} - ${counter} - ${address}`;

      // Encrypt message
      const encryptionClient = generateEncryptionClient(publicKey);

      const encryptedMessage = await encryptionClient.encryptMessage(JSON.stringify(message));
      const stringifiedEncryptedMessage = JSON.stringify(encryptedMessage);

      send({ message: stringifiedEncryptedMessage, sender: address });
      setCounter(counter => counter + 1);
    };

    const intervalId = setInterval(callback, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [send, counter, coords?.latitude, coords?.longitude, address, publicKey]);

  return {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  };
};
