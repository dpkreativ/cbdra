"use client";

import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface MapProps {
  posix: LatLngExpression;
  zoom?: number;
}

export default function Map({ posix, zoom }: MapProps) {
  return (
    <MapContainer center={posix} zoom={zoom || 12}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={posix} />
    </MapContainer>
  );
}
