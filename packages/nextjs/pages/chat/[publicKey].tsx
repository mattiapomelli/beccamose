import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import type { NextPage } from "next";
import { publicKeyToAddress } from "viem/accounts";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/Button";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceive } from "~~/sdk-new/hooks/useReceive";
import { useSendLocation } from "~~/sdk-new/hooks/useSendLocation";
import { useDerivedAccount } from "~~/sdk/crypto";

const Map = dynamic(() => import("../../components/my-map/my-map"), {
  ssr: false,
});

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degree: number): number => degree * (Math.PI / 180);

  // Convert degrees to radians
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Difference in coordinates
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  // Haversine formula
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of Earth in kilometers
  const R = 6371.0;

  // Distance in kilometers
  const distance = R * c;

  return distance;
}

const InvitePage: NextPage = () => {
  const { address } = useAccount();
  const router = useRouter();
  const publicKey = router.query.publicKey?.toString() as `0x${string}`;

  const hasMounted = useHasMounted();
  const { derivedAccount } = useDerivedAccount();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useSendLocation({
    publicKey,
  });
  const { coords: otherCoords } = useReceive();

  const { mutateAsync: mintNFT, isLoading } = useMutation({
    mutationFn: async () => {
      return fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          address1: address,
          address2: publicKeyToAddress(publicKey),
        }),
      });
    },
  });

  const onMint = async () => {
    await mintNFT();
  };

  const distanceBetweenPointsInMeters =
    haversineDistance(
      coords?.latitude || 0,
      coords?.longitude || 0,
      otherCoords?.latitude || 0,
      otherCoords?.longitude || 0,
    ) * 1000;

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center">
      <Map
        position1={[coords?.latitude || 0, coords?.longitude || 0]}
        position2={[otherCoords?.latitude || 0, otherCoords?.longitude || 0]}
      />

      {(distanceBetweenPointsInMeters === 0 || distanceBetweenPointsInMeters <= 100) && (
        <Button onClick={() => onMint()} disabled={isLoading} loading={isLoading}>
          Mint POM NFT
        </Button>
      )}

      <div className="bg-warning rounded-md p-4 w-full">
        <div className="break-words">Public key: {derivedAccount?.account.publicKey}</div>
        <div className="break-words">Private key: {derivedAccount?.privateKey}</div>
        <div className="break-words">isGeolocationAvailable: {isGeolocationAvailable.toString()}</div>
        <div className="break-words">isGeolocationEnabled: {isGeolocationEnabled.toString()}</div>
        <div className="break-words">Latitude: {coords?.latitude}</div>
        <div className="break-words">Longitude: {coords?.longitude}</div>
        <div className="break-words">Other Latitude: {otherCoords?.latitude}</div>
        <div className="break-words">Other Longitude: {otherCoords?.longitude}</div>
      </div>
    </div>
  );
};

export default InvitePage;
