import type { NextPage } from "next";
import { useGeolocated } from "react-geolocated";
import { Button } from "~~/components/ui/Button";
// import { Button } from "~~/components/ui/Button";
import { useReceiveLocation } from "~~/sdk/hooks/useReceiveLocation";
import { useShareLocation } from "~~/sdk/hooks/useShareLocation";

const WakuPage: NextPage = () => {
  const { shareLocation } = useShareLocation();
  const { coords } = useReceiveLocation();

  const {
    coords: geoCoords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      // enableHighAccuracy: true,
    },
    // suppressLocationOnMount: true,
    userDecisionTimeout: 5000,
    watchPosition: true,
  });

  return (
    <div>
      <div>Is enabled: {isGeolocationEnabled.toString()}</div>
      <div>Is available: {isGeolocationAvailable.toString()}</div>
      <div>Lat: {geoCoords?.latitude}</div>
      <div>
        Long:
        {geoCoords?.longitude}
      </div>
      <Button onClick={() => shareLocation()}>Share</Button>
      <div>Lat: {coords?.lat}</div>
      <div>
        Long:
        {coords?.lng}
      </div>
    </div>
  );
};

export default WakuPage;
