import type { NextPage } from "next";
import { useGeolocated } from "react-geolocated";
import { Button } from "~~/components/ui/Button";
import { useMessages, useSendMessage } from "~~/sdk";

const WakuPage: NextPage = () => {
  const { sendMessage } = useSendMessage();
  const { messages } = useMessages();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      // enableHighAccuracy: true,
    },
    // suppressLocationOnMount: true,
    userDecisionTimeout: 5000,
    watchPosition: true,
  });

  console.log("Messages: ", messages);

  console.log("isGeolocationEnabled", isGeolocationEnabled);
  console.log("isGeolocationAvailable", isGeolocationAvailable);

  return (
    <div>
      <div>Is enabled: {isGeolocationEnabled.toString()}</div>
      <div>Is available: {isGeolocationAvailable.toString()}</div>
      <div>Lat: {coords?.latitude}</div>
      <div>
        Long:
        {coords?.longitude}
      </div>
      <Button onClick={() => sendMessage()}>Send</Button>
    </div>
  );
};

export default WakuPage;
