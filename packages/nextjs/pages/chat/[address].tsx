import { useRouter } from "next/router";
import type { NextPage } from "next";
import { ErrorBoundary } from "react-error-boundary";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useConnectedPeers } from "~~/sdk/hooks/useConnectedPeers";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const ChatPageInner: NextPage = () => {
  const router = useRouter();
  const otherPublicKey = router.query.address?.toString();

  const hasMounted = useHasMounted();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useShareLocation({
    enabled: true,
    publicKey:
      "0x04d215413158bd253913dbca97ef3566e0d052a9b70f35ae7dbf1538ea30128a1dd5ab4bc09a5aac51172e2cf5b3153aef0d492fef515ce10d44fac20f0515d9aa",
  });

  const { coords: otherCoords } = useReceiveLocation({
    address: otherPublicKey || "",
  });

  const { allConnected, lightPushPeers } = useConnectedPeers();

  if (!hasMounted) return null;

  return (
    <div>
      <div>Peers Connected: {allConnected?.length}</div>
      <div>Push Peers Connected: {lightPushPeers?.length}</div>
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
  );
};

function fallbackRender({ error, resetErrorBoundary }: any) {
  resetErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

const ChatPage: NextPage = () => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender} onError={() => console.log(">>>> ERROR <<<<")}>
      <ChatPageInner />
    </ErrorBoundary>
  );
};

export default ChatPage;
