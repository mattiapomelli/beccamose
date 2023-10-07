import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const MyMap = () => {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "calc(100vh - 4rem)" }}
      >
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <button
        onClick={() => {
          const lat = position[0] * 1.00001;
          const lng = position[1] * 1.00001;
          setPosition([lat, lng]);
        }}
      >
        CLICK ME
      </button>
    </>
  );
};

export default MyMap;
