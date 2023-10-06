import { useEffect } from "react";
// import type { Peer } from "@libp2p/interface-peer-store";
import { LightNode } from "@waku/interfaces";
import { useWaku } from "@waku/react";
import type { NextPage } from "next";
import { useGeolocated } from "react-geolocated";
import { Button } from "~~/components/ui/Button";
// import { Button } from "~~/components/ui/Button";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const WakuPage: NextPage = () => {
  // const [peers, setPeers] = useState<Peer[]>([]);

  const { shareLocation } = useShareLocation();
  const { coords } = useReceiveLocation();

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

  const { node } = useWaku<LightNode>();
  const peerIds = node?.libp2p.getPeers();

  useEffect(() => {
    if (!node) return;

    const getPeers = async () => {
      const peerIds = node.libp2p.getPeers();
      const peers = await Promise.all(peerIds.map(id => node.libp2p.peerStore.get(id)));
      // setPeers(peers);

      console.log("Peers: ", peers);
    };

    getPeers();
  }, [node]);

  console.log("Peers: ", peerIds);

  const peerId = node?.libp2p.peerId.toString();

  return (
    <div>
      <div>Peer id: {peerId}</div>
      <div>
        Connected Peer ids:{" "}
        {peerIds?.map(peerId => (
          <div key={peerId.toString()}>- {peerId.toString()}</div>
        ))}
      </div>
      <div>Is enabled: {isGeolocationEnabled.toString()}</div>
      <div>Is available: {isGeolocationAvailable.toString()}</div>
      <div>My Lat: {geoCoords?.latitude}</div>
      <div>
        My Long:
        {geoCoords?.longitude}
      </div>
      <Button onClick={() => shareLocation()}>Share</Button>
      <div>Other Lat: {coords?.lat}</div>
      <div>
        Other Long:
        {coords?.lng}
      </div>
    </div>
  );
};

export default WakuPage;
