import type { NextPage } from "next";
import { Button } from "~~/components/ui/Button";
import { useMessages } from "~~/hooks/useMessages";
import { useSendMessage } from "~~/hooks/useSendMessage";

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
