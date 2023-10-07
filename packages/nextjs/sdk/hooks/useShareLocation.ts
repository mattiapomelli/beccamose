import { useEffect, useState } from "react";
import { ILocationMessagePayload } from "../types";
import { useSendMessage } from "./useSendMessage";
import { useGeolocated } from "react-geolocated";
import { useAccount } from "wagmi";

interface UseShareLocationParams {
  enabled?: boolean;
}

export const useShareLocation = (params?: UseShareLocationParams) => {
  const { address } = useAccount();
  const initialEnabled = params?.enabled ?? false;

  const [enabled, setEnabled] = useState(initialEnabled);

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
    if (!coords || !isGeolocationAvailable || !isGeolocationEnabled || !enabled || !address) return;

    const sendLocationMessage = async () => {
      console.log(">>> Sending location message");

      const message: ILocationMessagePayload = {
        lat: coords.latitude,
        lng: coords.longitude,
        senderPublicKey: "TODO",
        senderAddress: address,
      };

      sendMessage(JSON.stringify(message));
    };

    // Every X seconds send a message with the current location
    const intervalId = setInterval(sendLocationMessage, 3000);

    return () => clearInterval(intervalId);
  }, [coords, isGeolocationAvailable, isGeolocationEnabled, sendMessage, enabled, address]);

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
