import type { NextPage } from "next";
import { useGeolocated } from "react-geolocated";
import { Button } from "~~/components/ui/Button";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useConnectedPeers } from "~~/sdk/hooks/useConnectedPeers";
import { usePeerId } from "~~/sdk/hooks/usePeerId";
// import { Button } from "~~/components/ui/Button";
// import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

function orZero(value: undefined | number): number {
  return value || 0;
}

const WakuPage: NextPage = () => {
  // const [peers, setPeers] = useState<Peer[]>([]);

  const hasMounted = useHasMounted();

  const { shareLocation } = useShareLocation({
    enabled: true,
    publicKey: "0x",
  });
  // const { coords } = useReceiveLocation({
  //   publicKey: "0x",
  // });

  const {
    coords: geoCoords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      // enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    watchPosition: true,
  });

  const peerId = usePeerId();
  const { allConnected, filterPeers, lightPushPeers, storePeers } = useConnectedPeers();

  const allConnectedLength = orZero(allConnected?.length);
  const lightPushPeersLength = orZero(lightPushPeers?.length);
  const filterPeersLength = orZero(filterPeers?.length);
  const storePeersLength = orZero(storePeers?.length);

  if (!hasMounted) return null;

  return (
    <div>
      <div>My Peer id: {peerId}</div>
      <div>
        <div>
          Peers Connected: {allConnectedLength}
          <br />
          {/* {allConnected?.map(peerId => (
            <div key={peerId.toString()}>- {peerId.toString()}</div>
          ))} */}
        </div>
        <div className="mt-2">Store: {storePeersLength}</div>
        <div>Filter: {filterPeersLength}</div>
        <div>Light Push: {lightPushPeersLength}</div>
      </div>
      <div>Is location enabled: {isGeolocationEnabled.toString()}</div>
      <div>Is location available: {isGeolocationAvailable.toString()}</div>
      <div>My Lat: {geoCoords?.latitude}</div>
      <div>
        My Long:
        {geoCoords?.longitude}
      </div>
      <Button onClick={() => shareLocation()}>Share</Button>
      {/* <div>Other Lat: {coords?.latitude}</div>
      <div>
        Other Long:
        {coords?.longitude}
      </div> */}
    </div>
  );
};

export default WakuPage;
