import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceive } from "~~/sdk-new/hooks/useReceive";
// import { Button } from "~~/components/ui/Button";
import { useSendLocation } from "~~/sdk-new/hooks/useSendLocation";
import { useDerivedAccount } from "~~/sdk/crypto";

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
      <div>Send</div>
      <div>Public key: {derivedAccount?.account.publicKey}</div>
      <div>Private key: {derivedAccount?.privateKey}</div>
      <div>isGeolocationAvailable: {isGeolocationAvailable.toString()}</div>
      <div>isGeolocationEnabled: {isGeolocationEnabled.toString()}</div>
      <div>Latitude: {coords?.latitude}</div>
      <div>Longitude: {coords?.longitude}</div>
      <div>Other Latitude: {otherCoords?.latitude}</div>
      <div>Other Longitude: {otherCoords?.longitude}</div>
    </div>
  );
};

export default InvitePage;
