// import { useState } from "react";
import MarkerIcon from "./marker.svg";
// import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

// import { AcademicCapIcon } from "@heroicons/react/24/outline";

const iconPerson = new L.Icon({
  iconUrl: MarkerIcon.src,
  iconRetinaUrl: MarkerIcon.src,
  // iconAnchor: null,
  // popupAnchor: null,
  // shadowUrl: null,
  // shadowSize: null,
  // shadowAnchor: null,
  iconSize: new L.Point(30, 30),
  className: "leaflet-div-icon rounded-full",
});

interface MyMapProps {
  position1: [number, number];
  position2: [number, number];
}

const MyMap = ({ position1, position2 }: MyMapProps) => {
  // const [position1] = useState<[number, number]>([51.505, -0.09]);
  // const [position2] = useState<[number, number]>([51.705, -0.09]);

  // Calculate the center point
  // const centerLatitude = (position1[0] + position2[0]) / 2;
  // const centerLongitude = (position1[1] + position2[1]) / 2;
  // const mapCenter = [centerLatitude, centerLongitude];

  // const polyline = [position1, position2];

  if (position1[0] === 0 && position1[1] === 0) return null;

  return (
    <MapContainer center={position1} zoom={50} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Polyline pathOptions={{ color: "blue" }} positions={polyline} /> */}
      <Marker position={position1} icon={iconPerson} />
      <Marker position={position2} icon={iconPerson} />
    </MapContainer>
  );
};

export default MyMap;
