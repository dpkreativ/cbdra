import IncidentCard from "@/components/dashboard/incident-card";
import axiosInstance from "@/lib/axiosInstance";
import { incidentDocsSchema } from "@/schemas/incident";

export default async function AdminDashboardPage() {
  const { data } = await axiosInstance({
    method: "GET",
    url: "/api/incidents",
  });

  const incidents = incidentDocsSchema.parse(data);

  return (
    <main className="p-5">
      <section className="space-y-5">
        <h2 className="font-bold text-2xl">Recent Incidents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.$id}
              description={incident.description}
              type={incident.type}
              urgency={incident.urgency}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
