import IncidentForm from "@/components/dashboard/incidents/incident-form";
import { LocationProvider } from "@/context/location-context";
import Map from "@/components/dashboard/map";

export default function IncidentReportPage() {
  return (
    <main className="px-5 py-8 w-full max-w-2xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Report an Incident</h1>
      <LocationProvider>
        <div className="grid gap-6">
          <Map />
          <IncidentForm />
        </div>
      </LocationProvider>
    </main>
  );
}
