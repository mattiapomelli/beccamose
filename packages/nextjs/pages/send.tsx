import { useEffect, useState } from "react";
import type { NextPage } from "next";
// import { Button } from "~~/components/ui/Button";
import { useSend } from "~~/sdk/hooks/useSend";

const InvitePage: NextPage = () => {
  const { send } = useSend();
  const [counter, setCounter] = useState(0);

  // const onSend = () => {
  //   send(`Ciao ${counter}`);
  //   setCounter(counter => counter + 1);
  // };

  useEffect(() => {
    const callback = () => {
      send(`Ciao ${counter}`);
      setCounter(counter => counter + 1);
    };

    const intervalId = setInterval(callback, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [send, counter]);

  return (
    <div>
      Send
      {/* <Button onClick={() => onSend()}>Send</Button> */}
    </div>
  );
};

export default InvitePage;
