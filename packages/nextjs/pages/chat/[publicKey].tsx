import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useConnectedPeers } from "~~/sdk/hooks/useConnectedPeers";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const Map = dynamic(() => import("../../components/my-map/my-map"), {
  ssr: false,
});

const ChatPage: NextPage = () => {
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
      <Map
        position1={[coords?.latitude || 0, coords?.longitude || 0]}
        position2={[otherCoords?.latitude || 0, otherCoords?.longitude || 0]}
      />

      <div className="bg-warning rounded-md p-4">
        <h3 className="font-bold">Debug Zone</h3>
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

export default ChatPage;
