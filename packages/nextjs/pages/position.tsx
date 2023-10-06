import { useEffect, useState } from "react";
import type { NextPage } from "next";

const WakuPage: NextPage = () => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const callback = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
          console.log("Lat: ", position.coords.latitude, "Long: ", position.coords.longitude);
        },
        error => {
          console.log("Error: ", error);
        },
        {
          enableHighAccuracy: true,
        },
      );
    };

    const intervalId = setInterval(callback, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div>My Lat: {position.lat}</div>
      <div>My Long: {position.lng}</div>
    </div>
  );
};

export default WakuPage;
