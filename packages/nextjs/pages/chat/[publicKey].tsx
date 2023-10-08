import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { publicKeyToAddress } from "viem/accounts";
import { useAccount } from "wagmi";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceive } from "~~/sdk-new/hooks/useReceive";
import { useSendLocation } from "~~/sdk-new/hooks/useSendLocation";
import { useDerivedAccount } from "~~/sdk/crypto";

const Map = dynamic(() => import("../../components/my-map/my-map"), {
  ssr: false,
});

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

  const mintNFT = () => {
    fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: address,
        address1: address,
        address2: publicKeyToAddress(publicKey),
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

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center">
      <Map
        position1={[coords?.latitude || 0, coords?.longitude || 0]}
        position2={[otherCoords?.latitude || 0, otherCoords?.longitude || 0]}
      />

      <button className="btn btn-primary min-w-[15rem]" onClick={mintNFT}>
        Mint POM NFT
      </button>

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
