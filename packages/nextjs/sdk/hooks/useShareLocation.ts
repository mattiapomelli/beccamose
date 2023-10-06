import { useEffect, useState } from "react";
import { useSendMessage } from "./useSendMessage";
import { useGeolocated } from "react-geolocated";

export const useShareLocation = () => {
  const [enabled, setEnabled] = useState(true);

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
