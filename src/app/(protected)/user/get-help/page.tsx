import IncidentForm from "@/components/dashboard/incidents/incident-form";
import { LocationProvider } from "@/context/location-context";
import Map from "@/components/dashboard/map";

export default function IncidentReportPage() {
  return (
    <main className="p-5 flex flex-col gap-5">
      <LocationProvider>
        <div className="grid gap-5">
          <Map />
          <IncidentForm />
        </div>
      </LocationProvider>
    </main>
  );
}
