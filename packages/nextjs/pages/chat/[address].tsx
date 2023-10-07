// import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useConnectedPeers } from "~~/sdk/hooks/useConnectedPeers";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const ChatPage: NextPage = () => {
  // const router = useRouter();
  // const peerAddress = router.query.address?.toString();

  const hasMounted = useHasMounted();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useShareLocation({
    enabled: true,
  });

  const { coords: otherCoords } = useReceiveLocation();

  const { allConnected } = useConnectedPeers();

  if (!hasMounted) return null;

  return (
    <div>
      <div>Peers Connected: {allConnected?.length}</div>
      <div>Is location enabled: {isGeolocationEnabled.toString()}</div>
      <div>Is location available: {isGeolocationAvailable.toString()}</div>
      <div>My Lat: {coords?.latitude}</div>
      <div>
        My Long:
        {coords?.longitude}
      </div>
      <div>Other Lat: {otherCoords?.latitude}</div>
      <div>
        Other Long:
        {otherCoords?.longitude}
      </div>
    </div>
  );
};

export default ChatPage;
