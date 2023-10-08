import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import type { NextPage } from "next";
import { publicKeyToAddress } from "viem/accounts";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/Button";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useSendLocation } from "~~/sdk/hooks/useSendLocation";

// import { useDerivedAccount } from "~~/sdk/crypto";

const Map = dynamic(() => import("../../components/my-map/my-map"), {
  ssr: false,
});

const InvitePage: NextPage = () => {
  const { address } = useAccount();
  const router = useRouter();
  const publicKey = router.query.publicKey?.toString() as `0x${string}`;

  const hasMounted = useHasMounted();
  // const { derivedAccount } = useDerivedAccount();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useSendLocation({
    publicKey,
  });
  const { coords: otherCoords } = useReceiveLocation();

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

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center">
      <Map
        position1={[coords?.latitude || 0, coords?.longitude || 0]}
        position2={[otherCoords?.latitude || 0, otherCoords?.longitude || 0]}
      />

      <Button onClick={() => onMint()} disabled={isLoading} loading={isLoading}>
        Mint POM NFT
      </Button>

      <div className="bg-warning text-primary-content rounded-md p-4 w-full">
        {/* <div className="break-words">
          <span className="font-bold">Public key:</span> {derivedAccount?.account.publicKey}
        </div> */}
        {/* <div className="break-words">
          <span className="font-bold">Private key:</span> {derivedAccount?.privateKey}
        </div> */}
        <div className="break-words">
          <span className="font-bold">isGeolocationAvailable: </span>
          {isGeolocationAvailable.toString()}
        </div>
        <div className="break-words">
          <span className="font-bold">isGeolocationEnabled: </span>
          {isGeolocationEnabled.toString()}
        </div>
        <div className="break-words">
          <span className="font-bold">Your Latitude: </span>
          {coords?.latitude}
        </div>
        <div className="break-words">
          <span className="font-bold">Your Longitude: </span>
          {coords?.longitude}
        </div>
        <div className="break-words">
          <span className="font-bold">Peer Latitude:</span> {otherCoords?.latitude}
        </div>
        <div className="break-words">
          <span className="font-bold">Peer Longitude:</span> {otherCoords?.longitude}
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
