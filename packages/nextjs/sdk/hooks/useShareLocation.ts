import { useEffect, useState } from "react";
import { generateEncryptionClient, useDerivedAccountEncryption } from "../crypto";
import { ILocationMessagePayload } from "../types";
import { useSendMessage } from "./useSendMessage";
import { useGeolocated } from "react-geolocated";
import { useAccount } from "wagmi";

interface UseShareLocationParams {
  enabled?: boolean;
  publicKey: `0x${string}`;
}

export const useShareLocation = (params: UseShareLocationParams) => {
  const { address } = useAccount();
  const initialEnabled = params?.enabled ?? false;
  const publicKey = params?.publicKey ?? "";

  const [enabled, setEnabled] = useState(initialEnabled);

  const { getDerivedAccount } = useDerivedAccountEncryption();

  const { sendMessage } = useSendMessage();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      // enableHighAccuracy: true,
    },
    // suppressLocationOnMount: true,
    userDecisionTimeout: 3000,
    watchPosition: true,
  });

  // useEffect(() => {
  //   if (!isGeolocationAvailable || !isGeolocationEnabled || !enabled) return;

  //   const getCurrentPosition = () => {
  //     console.log("Effect");

  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         console.log("Got Position");
  //         sendMessage(JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }));
  //       },
  //       error => {
  //         console.log("Error: ", error);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //       },
  //     );
  //   };

  //   const intervalId = setInterval(getCurrentPosition, 1000);

  //   return () => clearInterval(intervalId);
  // }, [isGeolocationAvailable, isGeolocationEnabled, sendMessage, enabled]);

  useEffect(() => {
    if (!coords || !isGeolocationAvailable || !isGeolocationEnabled || !enabled || !address || !publicKey) return;

    const sendLocationMessage = async () => {
      console.log(">>> Sending location message");

      const derivedAccount = await getDerivedAccount();

      // const publicKey = "0x0447297d2906a3daab0b4968b16e6fb7600bbe00dc5edec32e215c635fb1a9d308bb2b0b4168fd37d5e1859c8da5a0895552a43b509bd9702ed129b9ba5530fd2c";

      const message: ILocationMessagePayload = {
        lat: coords.latitude,
        lng: coords.longitude,
        senderPublicKey: derivedAccount.account.publicKey,
        senderAddress: address,
      };

      const encryptionClient = generateEncryptionClient(publicKey);
      const encryptedMessage = await encryptionClient.encryptMessage(JSON.stringify(message));

      sendMessage(JSON.stringify(encryptedMessage));
    };

    // Every X seconds send a message with the current location
    const intervalId = setInterval(sendLocationMessage, 3000);

    return () => clearInterval(intervalId);
  }, [
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    sendMessage,
    enabled,
    address,
    publicKey,
    getDerivedAccount,
  ]);

  const shareLocation = () => {
    setEnabled(true);
  };

  return {
    shareLocation,
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  };
};
