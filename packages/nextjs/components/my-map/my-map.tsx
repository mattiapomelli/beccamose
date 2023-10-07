import { useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

const MyMap = () => {
  const [position1] = useState<[number, number]>([51.505, -0.09]);
  const [position2] = useState<[number, number]>([51.705, -0.09]);

  // Calculate the center point
  const centerLatitude = (position1[0] + position2[0]) / 2;
  const centerLongitude = (position1[1] + position2[1]) / 2;
  const mapCenter = [centerLatitude, centerLongitude];

  const polyline = [position1, position2];

  return (
    <MapContainer center={mapCenter as LatLngExpression} zoom={10} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline pathOptions={{ color: "blue" }} positions={polyline} />
    </MapContainer>
  );
};

export default MyMap;
