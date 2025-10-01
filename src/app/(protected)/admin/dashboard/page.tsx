"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Shield,
  Users,
  Activity,
} from "lucide-react";

import {
  IncidentDocs,
  IncidentData,
  IncidentStatus,
  IncidentUrgency,
  IncidentDoc,
} from "@/schemas/incidents";

interface Resource {
  id: string;
  name: string;
  type: "volunteer" | "ngo" | "gov";
  available: boolean;
  skills?: string[];
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "John Doe",
    type: "volunteer",
    available: true,
    skills: ["First Aid"],
  },
  {
    id: "2",
    name: "Red Cross NGO",
    type: "ngo",
    available: true,
    skills: ["Shelter"],
  },
  {
    id: "3",
    name: "Fire Department",
    type: "gov",
    available: true,
    skills: ["Rescue"],
  },
  {
    id: "4",
    name: "Jane Smith",
    type: "volunteer",
    available: true,
    skills: ["Counseling"],
  },
  {
    id: "5",
    name: "Emergency Services",
    type: "gov",
    available: false,
    skills: ["Emergency Response"],
  },
];

export default function AdminDashboardPage() {
  const [incidents, setIncidents] = useState<IncidentDocs>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDoc | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filterStatus, setFilterStatus] = useState<"all" | IncidentStatus>(
    "all"
  );
  const [assignResourceDialog, setAssignResourceDialog] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      setLoading(true);
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data: IncidentDocs = await res.json();
        setIncidents(data);
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  }

  function updateIncidentStatus(incidentId: string, status: IncidentStatus) {
    setIncidents((prev) =>
      prev.map((inc) => (inc.$id === incidentId ? { ...inc, status } : inc))
    );
    if (selectedIncident?.$id === incidentId) {
      setSelectedIncident({ ...selectedIncident, status });
    }
  }

  function assignResources() {
    if (!selectedIncident || selectedResources.length === 0) return;
    console.log("Assigning", selectedResources, "to", selectedIncident.$id);
    setAssignResourceDialog(false);
    setSelectedResources([]);
  }

  const filteredIncidents = incidents.filter(
    (inc) => filterStatus === "all" || inc.status === filterStatus
  );

  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => i.status === "pending").length,
    reviewed: incidents.filter((i) => i.status === "reviewed").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <main className="p-6 space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage incidents and allocate resources
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: <Activity />, color: "" },
          {
            label: "Pending",
            value: stats.pending,
            icon: <Clock />,
            color: "text-amber-600",
          },
          {
            label: "Reviewed",
            value: stats.reviewed,
            icon: <Shield />,
            color: "text-blue-600",
          },
          {
            label: "Resolved",
            value: stats.resolved,
            icon: <CheckCircle />,
            color: "text-emerald-600",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <span className="text-muted-foreground">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as IncidentStatus | "all")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List View */}
        <TabsContent value="list">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                Loading incidents…
              </CardContent>
            </Card>
          ) : filteredIncidents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                No incidents found
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.$id}>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {incident.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.urgency === "high"
                              ? "destructive"
                              : incident.urgency === "medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {incident.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{incident.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(incident.$createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Map View placeholder */}
        <TabsContent value="map">
          <Card>
            <CardContent className="p-8 text-center">
              Map view coming soon…
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Incident Details Dialog */}
      <Dialog
        open={!!selectedIncident}
        onOpenChange={(open) => !open && setSelectedIncident(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p>{selectedIncident.type}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
                  <p>{selectedIncident.category}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Urgency</span>
                  <Badge>{selectedIncident.urgency}</Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Select
                    value={selectedIncident.status}
                    onValueChange={(v) =>
                      updateIncidentStatus(
                        selectedIncident.$id,
                        v as IncidentStatus
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedIncident.description && (
                <p>{selectedIncident.description}</p>
              )}
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedIncident.lat},{selectedIncident.lng}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedIncident(null)}>
              Close
            </Button>
            <Button onClick={() => setAssignResourceDialog(true)}>
              <Users className="w-4 h-4 mr-2" />
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Assignment Dialog */}
      <Dialog
        open={assignResourceDialog}
        onOpenChange={setAssignResourceDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Resources</DialogTitle>
          </DialogHeader>
          {MOCK_RESOURCES.map((r) => (
            <Card key={r.id} className="p-3 flex items-center justify-between">
              <label
                className={`flex-1 flex gap-2 ${!r.available && "opacity-60"}`}
              >
                <input
                  type="checkbox"
                  checked={selectedResources.includes(r.id)}
                  onChange={(e) => {
                    setSelectedResources((prev) =>
                      e.target.checked
                        ? [...prev, r.id]
                        : prev.filter((id) => id !== r.id)
                    );
                  }}
                  disabled={!r.available}
                />
                <span>{r.name}</span>
                <Badge>{r.type.toUpperCase()}</Badge>
              </label>
              {!r.available && (
                <span className="text-xs text-muted-foreground">
                  Unavailable
                </span>
              )}
            </Card>
          ))}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignResourceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={assignResources}
              disabled={selectedResources.length === 0}
            >
              Assign ({selectedResources.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
