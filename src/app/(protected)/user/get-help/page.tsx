import IncidentForm from "@/components/dashboard/incidents/incident-form";
// import MapboxMap from "@/components/dashboard/map";
import { LocationProvider } from "@/context/location-context";

export default function IncidentReportPage() {
  return (
    <main className="p-5 flex flex-col gap-5">
      <LocationProvider>
        <div className="grid gap-5">
          {/* <MapboxMap /> */}
          <IncidentForm />
        </div>
      </LocationProvider>
    </main>
  );
}
