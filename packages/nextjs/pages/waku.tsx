import {
  LightNode, // PageDirection
} from "@waku/interfaces";
import { useContentPair, useFilterMessages, useLightPush, useWaku } from "@waku/react";
import type { NextPage } from "next";
import protobuf from "protobufjs";
import { Button } from "~~/components/ui/Button";

interface LocationMessage {
  timestamp: number;
  sender: string;
  message: string;
}

// Create a message structure using Protobuf
const LocationMessage = new protobuf.Type("LocationMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"));

const WakuPage: NextPage = () => {
  const { node } = useWaku<LightNode>();
  const { encoder, decoder } = useContentPair();
  const { push: onPush } = useLightPush({ node, encoder });

  const { messages: decodedMessages } = useFilterMessages({
    node,
    decoder,
    // options: {
    //   pageSize: 5,
    //   pageDirection: PageDirection.FORWARD,
    //   timeFilter: {
    //     startTime: new Date().setTime(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    //     endTime: new Date(),
    //   },
    // },
  });

  const messages = decodedMessages.map(message =>
    LocationMessage.decode(message.payload).toJSON(),
  ) as LocationMessage[];

  console.log("messages: ", messages);

  const onSend = async () => {
    if (!onPush) return;

    const timestamp = new Date();
    // Create a new message object
    const protoMessage = LocationMessage.create({
      timestamp: Date.now(),
      sender: "Alice",
      message: "Beccamose!",
    });
    // Serialise the message using Protobuf
    const payload = LocationMessage.encode(protoMessage).finish();

    const res = await onPush({ payload, timestamp });

    console.log("Result: ", res);
  };

  return (
    <div>
      <Button onClick={() => onSend()}>Send</Button>
    </div>
  );
};

export default WakuPage;
