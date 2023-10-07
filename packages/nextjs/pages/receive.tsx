import type { NextPage } from "next";
import { useReceive } from "~~/sdk-new/hooks/useReceive";

const ReceivePage: NextPage = () => {
  useReceive();

  return <>Receive</>;
};

export default ReceivePage;
