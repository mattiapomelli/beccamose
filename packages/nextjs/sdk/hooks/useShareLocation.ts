import { useEffect, useState } from "react";
import { useSendMessage } from "./useSendMessage";
import { useGeolocated } from "react-geolocated";

export const useShareLocation = () => {
  const [enabled, setEnabled] = useState(false);

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

  useEffect(() => {
    if (!coords || !isGeolocationAvailable || !isGeolocationEnabled || !enabled) return;

    const sendLocationMessage = async () => {
      sendMessage(JSON.stringify({ lat: coords.latitude, lng: coords.longitude }));
    };

    // Every 5 seconds send a message with the current location
    const intervalId = setInterval(sendLocationMessage, 5000);

    return () => clearInterval(intervalId);
  }, [coords, isGeolocationAvailable, isGeolocationEnabled, sendMessage, enabled]);

  const shareLocation = () => {
    setEnabled(true);
  };

  return {
    shareLocation,
  };
};
