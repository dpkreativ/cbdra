// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import Map, {
//   Marker,
//   NavigationControl,
//   GeolocateControl,
//   MapRef,
// } from "react-map-gl";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import { Button } from "@/components/ui/button";
// import { Icon } from "@/components/ui/icon";
// import { useLocation } from "@/context/location-context";

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// export default function MapboxMap() {
//   const { lat, lng, setLocation } = useLocation();
//   const mapRef = useRef<MapRef>(null);
//   const geocoderContainerRef = useRef<HTMLDivElement>(null);

//   const [viewState, setViewState] = useState({
//     longitude: lng,
//     latitude: lat,
//     zoom: 12,
//   });

//   // Sync marker position with context
//   useEffect(() => {
//     setViewState((prev) => ({
//       ...prev,
//       longitude: lng,
//       latitude: lat,
//     }));
//   }, [lat, lng]);

//   // Fly to location when context changes
//   useEffect(() => {
//     if (mapRef.current) {
//       mapRef.current.flyTo({
//         center: [lng, lat],
//         zoom: 14,
//         duration: 1500,
//       });
//     }
//   }, [lat, lng]);

//   // Initialize geocoder
//   useEffect(() => {
//     if (!mapRef.current || !geocoderContainerRef.current) return;

//     const map = mapRef.current.getMap();
//     const geocoder = new MapboxGeocoder({
//       accessToken: MAPBOX_TOKEN,
//       mapboxgl: map.constructor as any,
//       marker: false,
//       placeholder: "Search for location...",
//       proximity: {
//         longitude: lng,
//         latitude: lat,
//       } as any,
//     });

//     geocoderContainerRef.current.appendChild(geocoder.onAdd(map));

//     // Handle geocoder result
//     geocoder.on("result", (e: any) => {
//       const [longitude, latitude] = e.result.center;
//       setLocation(latitude, longitude);
//     });

//     return () => {
//       if (geocoderContainerRef.current) {
//         geocoderContainerRef.current.innerHTML = "";
//       }
//     };
//   }, [setLocation, lng, lat]);

//   // Handle map click to set marker
//   const handleMapClick = useCallback(
//     (event: any) => {
//       const { lngLat } = event;
//       setLocation(lngLat.lat, lngLat.lng);
//     },
//     [setLocation]
//   );

//   // Use geolocation
//   function handleUseMyLocation() {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setLocation(latitude, longitude);
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//         alert(
//           "Unable to retrieve your location. Please check your browser permissions."
//         );
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//       }
//     );
//   }

//   return (
//     <div className="flex flex-col gap-5 items-end">
//       <Button
//         onClick={handleUseMyLocation}
//         variant="outline"
//         className="ml-auto"
//         type="button"
//       >
//         <Icon icon="mage:location" width="24" height="24" />
//         Use My Location
//       </Button>

//       <div className="relative w-full h-[400px] rounded-md overflow-hidden border">
//         {/* Geocoder container */}
//         <div
//           ref={geocoderContainerRef}
//           className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-2"
//         />

//         {/* Map */}
//         <Map
//           ref={mapRef}
//           {...viewState}
//           onMove={(evt) => setViewState(evt.viewState)}
//           onClick={handleMapClick}
//           mapStyle="mapbox://styles/mapbox/streets-v12"
//           mapboxAccessToken={MAPBOX_TOKEN}
//           style={{ width: "100%", height: "100%" }}
//           attributionControl={false}
//         >
//           {/* Navigation Controls */}
//           <NavigationControl position="bottom-right" showCompass showZoom />

//           {/* Geolocate Control */}
//           <GeolocateControl
//             position="bottom-right"
//             trackUserLocation
//             showAccuracyCircle
//             onGeolocate={(e: any) => {
//               setLocation(e.coords.latitude, e.coords.longitude);
//             }}
//           />

//           {/* Marker */}
//           <Marker
//             longitude={lng}
//             latitude={lat}
//             anchor="bottom"
//             draggable
//             onDragEnd={(e) => {
//               setLocation(e.lngLat.lat, e.lngLat.lng);
//             }}
//           >
//             <div className="text-primary animate-bounce">
//               <Icon icon="mdi:map-marker" width="40" height="40" />
//             </div>
//           </Marker>
//         </Map>

//         {/* Coordinates display */}
//         <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-mono border shadow-sm">
//           {lat.toFixed(5)}, {lng.toFixed(5)}
//         </div>
//       </div>
//     </div>
//   );
// }
