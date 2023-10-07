import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceive } from "~~/sdk-new/hooks/useReceive";
// import { Button } from "~~/components/ui/Button";
import { useSendLocation } from "~~/sdk-new/hooks/useSendLocation";

const InvitePage: NextPage = () => {
  const hasMounted = useHasMounted();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useSendLocation();
  useReceive();

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
    </div>
  );
};

export default InvitePage;
