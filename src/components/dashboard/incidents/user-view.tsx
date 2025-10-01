"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { IncidentData, IncidentDocs } from "@/schemas/incidents";

interface Stats {
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
  avgResponseTime: string;
}

export function IncidentsStats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0,
    avgResponseTime: "N/A",
  });

  const [loading, setLoading] = useState(true);
  const [recentIncidents, setRecentIncidents] = useState<IncidentData[]>([]);

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      try {
        const res = await fetch("/api/incidents");
        const incidents: IncidentData[] = (await res.json()) || [];

        setRecentIncidents(
          incidents
            .sort(
              (a: any, b: any) =>
                new Date((b as any).$createdAt).getTime() -
                new Date((a as any).$createdAt).getTime()
            )
            .slice(0, 5)
        ); // last 5 incidents

        const total = incidents.length;
        const pending = incidents.filter((i) => i.status === "pending").length;
        const reviewed = incidents.filter(
          (i) => i.status === "reviewed"
        ).length;
        const resolved = incidents.filter(
          (i) => i.status === "resolved"
        ).length;

        const resolvedIncidents = incidents.filter(
          (i) =>
            i.status === "resolved" &&
            (i as any).$createdAt &&
            (i as any).$updatedAt
        );

        let avgResponseTime = "N/A";
        if (resolvedIncidents.length > 0) {
          const totalMinutes = resolvedIncidents.reduce((acc, i) => {
            const created = new Date((i as any).$createdAt).getTime();
            const updated = new Date((i as any).$updatedAt).getTime();
            return acc + (updated - created) / 1000 / 60;
          }, 0);

          avgResponseTime = `${Math.round(
            totalMinutes / resolvedIncidents.length
          )} min`;
        }

        setStats({ total, pending, reviewed, resolved, avgResponseTime });
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  const renderStatCard = (
    title: string,
    value: number | string,
    icon: React.ReactNode,
    subtitle: string,
    color?: string
  ) => (
    <Card key={title}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color || ""}`}>
          {loading ? (
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );

  return (
    <section className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {renderStatCard(
          "Total Reports",
          stats.total,
          <FileText className="w-4 h-4 text-muted-foreground" />,
          "Community incidents"
        )}
        {renderStatCard(
          "Pending",
          stats.pending,
          <Clock className="w-4 h-4 text-amber-500" />,
          "Being reviewed",
          "text-amber-600"
        )}
        {renderStatCard(
          "Reviewed",
          stats.reviewed,
          <TrendingUp className="w-4 h-4 text-yellow-500" />,
          "Under review",
          "text-yellow-600"
        )}
        {renderStatCard(
          "Resolved",
          stats.resolved,
          <CheckCircle className="w-4 h-4 text-emerald-500" />,
          "Successfully handled",
          "text-emerald-600"
        )}
        {renderStatCard(
          "Avg Response",
          stats.avgResponseTime,
          <TrendingUp className="w-4 h-4 text-primary" />,
          "Community response time"
        )}
      </div>

      {/* Recent Activity */}
      <RecentActivity incidents={recentIncidents} loading={loading} />
    </section>
  );
}

// Component to display recent incidents
interface RecentActivityProps {
  incidents: IncidentData[];
  loading: boolean;
}

function RecentActivity({ incidents, loading }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-4 w-full bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <p className="text-muted-foreground">No recent incidents</p>
        ) : (
          <ul className="space-y-2">
            {incidents.map((incident, idx) => (
              <li key={idx} className="border-b pb-1">
                <Link
                  href={`/user/incidents/${`1`}`}
                  className="block hover:bg-gray-50 rounded p-2 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{incident.type}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {incident.status}
                    </span>
                  </div>
                  {incident.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {incident.notes}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
