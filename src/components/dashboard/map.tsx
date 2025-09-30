// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import Map, {
//   Marker,
//   NavigationControl,
//   GeolocateControl,
//   MapRef,
//   Popup,
// } from "react-map-gl";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import { Button } from "@/components/ui/button";
// import { Icon } from "@/components/ui/icon";
// import { useLocation } from "@/context/location-context";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Clock, MapPin, AlertTriangle } from "lucide-react";

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// interface Incident {
//   $id: string;
//   category: string;
//   type: string;
//   description?: string;
//   urgency: "low" | "medium" | "high";
//   lat: number;
//   lng: number;
//   status: string;
//   $createdAt: string;
//   userId: string;
//   notes?: string;
// }

// const URGENCY_COLORS = {
//   low: "#10b981",
//   medium: "#f59e0b",
//   high: "#ef4444",
// };

// const CATEGORY_ICONS: Record<string, string> = {
//   water: "carbon:flood",
//   biological: "solar:virus-outline",
//   fire: "carbon:fire",
//   geological: "carbon:earthquake",
//   crime: "carbon:police",
//   "man-made": "hugeicons:accident",
//   industrial: "carbon:industry",
//   other: "carbon:warning",
// };

// export default function MapboxMap({
//   incidents = [],
//   showIncidents = true,
//   onIncidentClick,
//   isReporting = false,
// }: {
//   incidents?: Incident[];
//   showIncidents?: boolean;
//   onIncidentClick?: (incident: Incident) => void;
//   isReporting?: boolean;
// }) {
//   const { lat, lng, setLocation } = useLocation();
//   const mapRef = useRef<MapRef>(null);
//   const geocoderContainerRef = useRef<HTMLDivElement>(null);
//   const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
//     null
//   );

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
//       if (isReporting) {
//         setLocation(latitude, longitude);
//       }
//     });

//     return () => {
//       if (geocoderContainerRef.current) {
//         geocoderContainerRef.current.innerHTML = "";
//       }
//     };
//   }, [setLocation, lng, lat, isReporting]);

//   // Handle map click to set marker (only when reporting)
//   const handleMapClick = useCallback(
//     (event: any) => {
//       if (isReporting) {
//         const { lngLat } = event;
//         setLocation(lngLat.lat, lngLat.lng);
//       }
//     },
//     [setLocation, isReporting]
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

//   function formatDate(dateString: string) {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

//     if (diffHours < 1) {
//       const diffMins = Math.floor(diffMs / (1000 * 60));
//       return `${diffMins} mins ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours} hours ago`;
//     } else {
//       const diffDays = Math.floor(diffHours / 24);
//       return `${diffDays} days ago`;
//     }
//   }

//   return (
//     <div className="flex flex-col gap-5 items-end">
//       {isReporting && (
//         <Button
//           onClick={handleUseMyLocation}
//           variant="outline"
//           className="ml-auto"
//           type="button"
//         >
//           <Icon icon="mage:location" width="24" height="24" />
//           Use My Location
//         </Button>
//       )}

//       <div className="relative w-full h-[500px] rounded-md overflow-hidden border">
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
//               if (isReporting) {
//                 setLocation(e.coords.latitude, e.coords.longitude);
//               }
//             }}
//           />

//           {/* Current Location Marker (when reporting) */}
//           {isReporting && (
//             <Marker
//               longitude={lng}
//               latitude={lat}
//               anchor="bottom"
//               draggable
//               onDragEnd={(e) => {
//                 setLocation(e.lngLat.lat, e.lngLat.lng);
//               }}
//             >
//               <div className="text-primary animate-bounce">
//                 <Icon icon="mdi:map-marker" width="40" height="40" />
//               </div>
//             </Marker>
//           )}

//           {/* Incident Markers */}
//           {showIncidents &&
//             incidents.map((incident) => (
//               <Marker
//                 key={incident.$id}
//                 longitude={incident.lng}
//                 latitude={incident.lat}
//                 anchor="bottom"
//                 onClick={(e) => {
//                   e.originalEvent.stopPropagation();
//                   setSelectedIncident(incident);
//                   if (onIncidentClick) {
//                     onIncidentClick(incident);
//                   }
//                 }}
//               >
//                 <div
//                   className="cursor-pointer transition-transform hover:scale-110"
//                   style={{ color: URGENCY_COLORS[incident.urgency] }}
//                 >
//                   <Icon
//                     icon={
//                       CATEGORY_ICONS[incident.category] || CATEGORY_ICONS.other
//                     }
//                     width="32"
//                     height="32"
//                   />
//                 </div>
//               </Marker>
//             ))}

//           {/* Popup for selected incident */}
//           {selectedIncident && (
//             <Popup
//               longitude={selectedIncident.lng}
//               latitude={selectedIncident.lat}
//               anchor="bottom"
//               onClose={() => setSelectedIncident(null)}
//               closeButton={true}
//               closeOnClick={false}
//               offsetTop={-10}
//             >
//               <Card className="border-0 shadow-none">
//                 <CardHeader className="p-3">
//                   <div className="flex justify-between items-start gap-2">
//                     <CardTitle className="text-sm font-semibold">
//                       {selectedIncident.type}
//                     </CardTitle>
//                     <Badge
//                       variant={
//                         selectedIncident.urgency === "high"
//                           ? "destructive"
//                           : selectedIncident.urgency === "medium"
//                           ? "secondary"
//                           : "default"
//                       }
//                       className="text-xs"
//                     >
//                       {selectedIncident.urgency}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-3 pt-0 space-y-2">
//                   {selectedIncident.description && (
//                     <p className="text-xs text-muted-foreground line-clamp-2">
//                       {selectedIncident.description}
//                     </p>
//                   )}
//                   <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                     <span className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {formatDate(selectedIncident.$createdAt)}
//                     </span>
//                     <Badge variant="outline" className="text-xs">
//                       {selectedIncident.status}
//                     </Badge>
//                   </div>
//                   {onIncidentClick && (
//                     <Button
//                       size="sm"
//                       className="w-full mt-2"
//                       onClick={() => onIncidentClick(selectedIncident)}
//                     >
//                       View Details
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </Popup>
//           )}
//         </Map>

//         {/* Coordinates display */}
//         {isReporting && (
//           <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-mono border shadow-sm">
//             {lat.toFixed(5)}, {lng.toFixed(5)}
//           </div>
//         )}

//         {/* Legend for incidents */}
//         {showIncidents && incidents.length > 0 && (
//           <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-2 rounded-md border shadow-sm">
//             <p className="text-xs font-semibold mb-1">Urgency Levels</p>
//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <div
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: URGENCY_COLORS.high }}
//                 />
//                 <span className="text-xs">High</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: URGENCY_COLORS.medium }}
//                 />
//                 <span className="text-xs">Medium</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: URGENCY_COLORS.low }}
//                 />
//                 <span className="text-xs">Low</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
