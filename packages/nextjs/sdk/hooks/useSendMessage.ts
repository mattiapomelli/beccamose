import { LocationMessage } from "../constants";
import { LightNode } from "@waku/interfaces";
import { useContentPair, useLightPush, useWaku } from "@waku/react";
import { useGeolocated } from "react-geolocated";

export const useSendMessage = () => {
  const { node } = useWaku<LightNode>();
  const { encoder } = useContentPair();
  const { push: onPush } = useLightPush({ node, encoder });

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const sendMessage = async () => {
    if (!onPush || !coords) return;

    const timestamp = new Date();
    // Create a new message object
    const protoMessage = LocationMessage.create({
      timestamp: Date.now(),
      sender: "Alice",
      message: JSON.stringify({
        lat: coords.latitude,
        long: coords.longitude,
      }),
      nonce: Math.floor(Math.random() * 1000000000000),
    });
    // Serialise the message using Protobuf
    const payload = LocationMessage.encode(protoMessage).finish();

    const res = await onPush({ payload, timestamp });

    return res;
  };

  return {
    sendMessage,
  };
};
