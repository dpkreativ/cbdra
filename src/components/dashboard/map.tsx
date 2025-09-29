"use client";

import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-geosearch/dist/geosearch.css";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useLocation } from "@/context/location-context";

interface GeoSearchResult {
  x: number; // lon
  y: number; // lat
  // label: string; // formatted address
  // bounds: [
  //   [number, number], // south, west - lat, lon
  //   [number, number] // north, east - lat, lon
  // ];
  // raw: any; // raw provider result
}

function SearchControl({
  setMarkerPos,
}: {
  setMarkerPos: (pos: LatLngExpression) => void;
}) {
  const map = useMap();
  const { setLocation } = useLocation();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false,
      showPopup: false,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    const handleLocation = (result: unknown) => {
      const { x: lng, y: lat } = result as GeoSearchResult;
      setMarkerPos([lat, lng]);
      setLocation(lat, lng);
      map.flyTo([lat, lng], 14);
    };

    map.on("geosearch/showlocation", handleLocation);

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation", handleLocation);
    };
  }, [map, setMarkerPos, setLocation]);

  return null;
}

/**
 * Keeps map centered on context location with smooth animation
 */
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [lat, lng, map]);

  return null;
}

export default function Map() {
  const { lat, lng, setLocation } = useLocation();
  const [markerPos, setMarkerPos] = useState<LatLngExpression>([lat, lng]);

  // ✅ Sync marker with context
  useEffect(() => {
    setMarkerPos([lat, lng]);
  }, [lat, lng]);

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(latitude, longitude); // marker + map recenter handled by effect
      },
      () => alert("Unable to retrieve your location")
    );
  }

  return (
    <div className="flex flex-col gap-5 items-end">
      <Button
        onClick={handleUseMyLocation}
        variant="outline"
        className="ml-auto"
      >
        <Icon icon="mage:location" width="24" height="24" />
        Use My Location
      </Button>

      <MapContainer
        className="z-0 w-full h-[400px] rounded-md"
        center={markerPos}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Marker position={markerPos} />
        <SearchControl setMarkerPos={setMarkerPos} />
        <RecenterMap lat={lat} lng={lng} /> {/* 🔑 smooth pan/zoom */}
      </MapContainer>
    </div>
  );
}
