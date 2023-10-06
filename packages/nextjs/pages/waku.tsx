import type { NextPage } from "next";
import { useGeolocated } from "react-geolocated";
import { Button } from "~~/components/ui/Button";
import { useMessages, useSendMessage } from "~~/sdk";

const WakuPage: NextPage = () => {
  const { sendMessage } = useSendMessage();
  const { messages } = useMessages();

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  console.log("Messages: ", messages);

  return (
    <div>
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
