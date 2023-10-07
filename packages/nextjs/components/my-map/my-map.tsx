import { useEffect, useState } from "react";
import MarkerIcon from "./marker.svg";
import html2canvas from "html2canvas";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useAccount } from "wagmi";

interface MyMapProps {
  position1: [number, number];
  position2: [number, number];
}

const otherPersonIcon = new L.Icon({
  iconUrl: MarkerIcon.src,
  iconRetinaUrl: MarkerIcon.src,
  iconSize: new L.Point(30, 30),
  className: "leaflet-div-icon rounded-full",
});

async function captureComponentAsImage() {
  const node = document.querySelector("#blokio");
  if (!node) return undefined;

  const canvas = await html2canvas(node as HTMLElement);
  const dataURL = canvas.toDataURL("image/png");

  return dataURL;
}

const MyMap = ({ position1, position2 }: MyMapProps) => {
  const [myPersonalIcon, setMyPersonalIcon] = useState<L.Icon>();
  const { address } = useAccount();

  useEffect(() => {
    const generateImage = async () => {
      if (!address) return;
      const url = await captureComponentAsImage();
      const iconPerson = new L.Icon({
        iconUrl: url ?? MarkerIcon.src,
        iconRetinaUrl: url ?? MarkerIcon.src,
        iconSize: new L.Point(30, 30),
        className: "leaflet-div-icon rounded-full",
      });
      setMyPersonalIcon(iconPerson);
    };

    generateImage();
  }, [address]);

  if ((position1[0] === 0 && position1[1] === 0) || !myPersonalIcon) return null;

  return (
    <MapContainer center={position1} zoom={50} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position1} icon={myPersonalIcon} />
      <Marker position={position2} icon={otherPersonIcon} />
    </MapContainer>
  );
};

export default MyMap;
