import { useEffect, useState } from "react";
import { useSend } from "./useSend";
import { useGeolocated } from "react-geolocated";
import { useAccount } from "wagmi";

export const useSendLocation = () => {
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
    const callback = () => {
      const message = `${coords?.latitude} - ${coords?.longitude} - ${counter} - ${address}`;

      send(message);
      setCounter(counter => counter + 1);
    };

    const intervalId = setInterval(callback, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [send, counter, coords?.latitude, coords?.longitude]);

  return {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  };
};
