import type { NextPage } from "next";
import { Button } from "~~/components/ui/Button";
import { useMessages, useSendMessage } from "~~/sdk";

const WakuPage: NextPage = () => {
  const { sendMessage } = useSendMessage();
  const { messages } = useMessages();

  console.log("Messages: ", messages);

  return (
    <div>
      <Button onClick={() => sendMessage()}>Send</Button>
    </div>
  );
};

export default WakuPage;
