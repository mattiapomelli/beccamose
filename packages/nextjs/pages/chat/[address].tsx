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
    publicKey: (otherPublicKey || "") as `0x${string}`,
  });

  const { coords: otherCoords } = useReceiveLocation({
    publicKey: (otherPublicKey || "") as `0x${string}`,
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
