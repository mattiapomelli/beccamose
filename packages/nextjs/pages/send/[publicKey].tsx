import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
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

  if (!hasMounted) {
    return null;
  }

  return (
    <div>
      <div>Send</div>
      <div>isGeolocationAvailable: {isGeolocationAvailable.toString()}</div>
      <div>isGeolocationEnabled: {isGeolocationEnabled.toString()}</div>
      <div>Latitude: {coords?.latitude}</div>
      <div>Longitude: {coords?.longitude}</div>
      <div>Public key: {derivedAccount?.account.publicKey}</div>
      <div>Private key: {derivedAccount?.privateKey}</div>
    </div>
  );
};

export default InvitePage;
