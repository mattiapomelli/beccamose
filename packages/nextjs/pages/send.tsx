import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useGeolocated } from "react-geolocated";
import { useHasMounted } from "~~/hooks/useHasMounted";
// import { Button } from "~~/components/ui/Button";
import { useSend } from "~~/sdk-new/hooks/useSend";

const InvitePage: NextPage = () => {
  const { send } = useSend();
  const [counter, setCounter] = useState(0);
  const hasMounted = useHasMounted();

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
      const message = `${coords?.latitude} - ${coords?.longitude} - ${counter}`;

      send(message);
      setCounter(counter => counter + 1);
    };

    const intervalId = setInterval(callback, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [send, counter, coords?.latitude, coords?.longitude]);

  if (!hasMounted) {
    return null;
  }

  return (
    <div>
      <div>Send</div>
      <div>isGeolocationAvailable: {isGeolocationAvailable.toString()}</div>
      <div>isGeolocationEnabled: {isGeolocationEnabled.toString()}</div>
      <div>Latitude: {coords?.latitude}</div>
      <div>Longitude: {coords?.longitude}</div>
    </div>
  );
};

export default InvitePage;
