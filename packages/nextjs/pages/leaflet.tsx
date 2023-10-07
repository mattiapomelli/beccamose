import dynamic from "next/dynamic";
import type { NextPage } from "next";

const Map = dynamic(() => import("../components/my-map/my-map"), {
  ssr: false,
});

const Leaflet: NextPage = () => {
  return <Map />;
};

export default Leaflet;
