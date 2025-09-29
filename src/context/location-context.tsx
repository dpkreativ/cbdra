"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LocationContextType {
  lat: number;
  lng: number;
  setLocation: (lat: number, lng: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [lat, setLat] = useState(33.749);
  const [lng, setLng] = useState(-84.38798);

  function setLocation(newLat: number, newLng: number) {
    setLat(newLat);
    setLng(newLng);
  }

  return (
    <LocationContext.Provider value={{ lat, lng, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
