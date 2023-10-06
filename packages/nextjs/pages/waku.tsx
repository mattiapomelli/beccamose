import { LightNode } from "@waku/interfaces";
import { useContentPair, useLightPush, useWaku } from "@waku/react";
import type { NextPage } from "next";
import protobuf from "protobufjs";
import { Button } from "~~/components/ui/Button";

const WakuPage: NextPage = () => {
  const { node } = useWaku<LightNode>();
  const { encoder } = useContentPair();
  const { push: onPush } = useLightPush({ node, encoder });

  const onSend = async () => {
    if (!onPush) return;

    // Create a message structure using Protobuf
    const ChatMessage = new protobuf.Type("ChatMessage")
      .add(new protobuf.Field("timestamp", 1, "uint64"))
      .add(new protobuf.Field("sender", 2, "string"))
      .add(new protobuf.Field("message", 3, "string"));

    const timestamp = new Date();
    // Create a new message object
    const protoMessage = ChatMessage.create({
      timestamp: Date.now(),
      sender: "Alice",
      message: "Beccamose!",
    });
    // Serialise the message using Protobuf
    const payload = ChatMessage.encode(protoMessage).finish();

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
