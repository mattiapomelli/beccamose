import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useConnectedPeers } from "~~/sdk/hooks/useConnectedPeers";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const Map = dynamic(() => import("../../components/my-map/my-map"), {
  ssr: false,
});

// function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const toRadians = (degree: number): number => degree * (Math.PI / 180);

//   // Convert degrees to radians
//   lat1 = toRadians(lat1);
//   lon1 = toRadians(lon1);
//   lat2 = toRadians(lat2);
//   lon2 = toRadians(lon2);

//   // Difference in coordinates
//   const dlat = lat2 - lat1;
//   const dlon = lon2 - lon1;

//   // Haversine formula
//   const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   // Radius of Earth in kilometers
//   const R = 6371.0;

//   // Distance in kilometers
//   const distance = R * c;

//   return distance;
// }

const ChatPage: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const hasMounted = useHasMounted();

  const otherPublicKey = router.query.publicKey?.toString();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useShareLocation({
    enabled: true,
    publicKey: (otherPublicKey || "") as `0x${string}`,
  });

  const { coords: otherCoords } = useReceiveLocation({
    publicKey: (otherPublicKey || "") as `0x${string}`,
  });

  const { allConnected, lightPushPeers, filterPeers } = useConnectedPeers();

  // const distanceBetweenPointsInMeters =
  //   haversineDistance(
  //     coords?.latitude || 0,
  //     coords?.longitude || 0,
  //     otherCoords?.latitude || 0,
  //     otherCoords?.longitude || 0,
  //   ) / 1000;

  const mintNFT = () => {
    fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({
        address: address,
        address1: address,
        address2: otherCoords?.senderAddress,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("NFT MINTED", data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  if (!hasMounted) return null;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Map
        position1={[coords?.latitude || 0, coords?.longitude || 0]}
        position2={[otherCoords?.latitude || 0, otherCoords?.longitude || 0]}
      />

      <button className="btn btn-primary min-w-[15rem]" onClick={mintNFT}>
        Mint Proof of Meet
      </button>

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
