// import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const ChatPage: NextPage = () => {
  // const router = useRouter();
  // const peerAddress = router.query.address?.toString();

  const { coords } = useShareLocation({
    enabled: true,
  });

  return (
    <div>
      <div>My Lat: {coords?.latitude}</div>
      <div>
        My Long:
        {coords?.longitude}
      </div>
    </div>
  );
};

export default ChatPage;
