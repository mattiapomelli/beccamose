import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useConnectedPeers } from "~~/sdk/hooks/useConnectedPeers";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const ChatPageInner: NextPage = () => {
  const router = useRouter();
  const otherPublicKey = router.query.publicKey?.toString();

  const hasMounted = useHasMounted();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useShareLocation({
    enabled: true,
    publicKey: (otherPublicKey || "") as `0x${string}`,
  });

  const { coords: otherCoords } = useReceiveLocation({
    publicKey: (otherPublicKey || "") as `0x${string}`,
  });

  const { allConnected, lightPushPeers, filterPeers } = useConnectedPeers();

  if (!hasMounted) return null;

  return (
    <div>
      <div className="bg-warning rounded-md p-4">
        <div>Peers Connected: {allConnected?.length}</div>
        <div>Push Peers Connected: {lightPushPeers?.length}</div>
        <div>Filter Peers Connected: {filterPeers?.length}</div>
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
    </div>
  );
};

const ChatPage: NextPage = () => {
  return <ChatPageInner />;
};

export default ChatPage;
