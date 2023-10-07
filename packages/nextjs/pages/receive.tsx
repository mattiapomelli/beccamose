import type { NextPage } from "next";
import { useReceive } from "~~/sdk/hooks/useReceive";

const ReceivePage: NextPage = () => {
  useReceive();

  return <>Receive</>;
};

export default ReceivePage;
