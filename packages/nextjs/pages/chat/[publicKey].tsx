import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceive } from "~~/sdk-new/hooks/useReceive";
import { useSendLocation } from "~~/sdk-new/hooks/useSendLocation";
import { useDerivedAccount } from "~~/sdk/crypto";

const Map = dynamic(() => import("../../components/my-map/my-map"), {
  ssr: false,
});

const InvitePage: NextPage = () => {
  const router = useRouter();
  const publicKey = router.query.publicKey?.toString() as `0x${string}`;

  const hasMounted = useHasMounted();
  const { derivedAccount } = useDerivedAccount();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useSendLocation({
    publicKey,
  });
  const { coords: otherCoords } = useReceive();

  if (!hasMounted) {
    return null;
  }

  return (
    <div>
      <Map
        position1={[coords?.latitude || 0, coords?.longitude || 0]}
        position2={[otherCoords?.latitude || 0, otherCoords?.longitude || 0]}
      />
      <div className="bg-warning rounded-md p-4">
        <div>Public key: {derivedAccount?.account.publicKey}</div>
        <div>Private key: {derivedAccount?.privateKey}</div>
        <div>isGeolocationAvailable: {isGeolocationAvailable.toString()}</div>
        <div>isGeolocationEnabled: {isGeolocationEnabled.toString()}</div>
        <div>Latitude: {coords?.latitude}</div>
        <div>Longitude: {coords?.longitude}</div>
        <div>Other Latitude: {otherCoords?.latitude}</div>
        <div>Other Longitude: {otherCoords?.longitude}</div>
      </div>
    </div>
  );
};

export default InvitePage;
