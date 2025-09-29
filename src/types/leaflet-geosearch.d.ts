declare module "leaflet-geosearch" {
  import { Control } from "leaflet";

  export interface GeoSearchControlOptions {
    provider: OpenStreetMapProvider;
    style?: string;
    autoComplete?: boolean;
    autoCompleteDelay?: number;
    showMarker?: boolean;
    showPopup?: boolean;
    retainZoomLevel?: boolean;
    animateZoom?: boolean;
    keepResult?: boolean;
  }

  export class GeoSearchControl extends Control {
    constructor(options: GeoSearchControlOptions);
  }

  export class OpenStreetMapProvider {
    constructor(options?: OpenStreetMapProviderOptions);
  }
}
