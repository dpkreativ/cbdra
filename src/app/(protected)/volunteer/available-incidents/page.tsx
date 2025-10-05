"use client";

import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Shield,
  Building,
  Heart,
} from "lucide-react";

/* -------------------------------
   Types
-------------------------------- */
type ResourceType = "volunteer" | "ngo" | "gov";

interface Resource {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: ResourceType;
  available: boolean;
  skills: string[];
  location: string;
  joinedDate: string;
  assignedIncidents: number;
  resolvedIncidents: number;
  rating: number;
}

interface TypeConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
}

/* -------------------------------
   Mock Data (US-based)
-------------------------------- */
const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (404) 123-4567",
    type: "volunteer",
    available: true,
    skills: ["First Aid", "Search & Rescue"],
    location: "Atlanta, Georgia",
    joinedDate: "2024-01-15",
    assignedIncidents: 12,
    resolvedIncidents: 10,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Red Cross Atlanta",
    email: "contact@redcross.org",
    phone: "+1 (470) 234-5678",
    type: "ngo",
    available: true,
    skills: ["Shelter", "Medical Aid", "Food Distribution"],
    location: "Atlanta, Georgia",
    joinedDate: "2023-06-20",
    assignedIncidents: 45,
    resolvedIncidents: 42,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (678) 345-6789",
    type: "volunteer",
    available: false,
    skills: ["Counseling", "Community Outreach"],
    location: "Atlanta, Georgia",
    joinedDate: "2024-03-10",
    assignedIncidents: 8,
    resolvedIncidents: 7,
    rating: 4.6,
  },
  {
    id: "4",
    name: "Atlanta Fire Department",
    email: "fire@atlanta.gov",
    phone: "+1 (404) 555-7890",
    type: "gov",
    available: true,
    skills: ["Fire Response", "Emergency Rescue", "Safety"],
    location: "Atlanta, Georgia",
    joinedDate: "2023-01-05",
    assignedIncidents: 78,
    resolvedIncidents: 75,
    rating: 4.95,
  },
];

/* -------------------------------
   Config for Resource Types
-------------------------------- */
const TYPE_CONFIG: Record<ResourceType, TypeConfig> = {
  volunteer: {
    label: "Volunteer",
    icon: <Heart className="w-8 h-8" />,
    color: "text-blue-600 bg-blue-100",
  },
  ngo: {
    label: "NGO",
    icon: <Building className="w-8 h-8" />,
    color: "text-purple-600 bg-purple-100",
  },
  gov: {
    label: "Government",
    icon: <Shield className="w-8 h-8" />,
    color: "text-emerald-600 bg-emerald-100",
  },
};

/* -------------------------------
   Component
-------------------------------- */
export default function ResourcesAdminPage() {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<ResourceType | "all">("all");
  const [filterAvailability, setFilterAvailability] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [viewDetailsDialog, setViewDetailsDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ResourceType | "all">("all");

  // Event handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (resource: Resource): void => {
    setSelectedResource(resource);
    setViewDetailsDialog(true);
  };

  const toggleAvailability = (id: string): void => {
    setResources((prevResources) =>
      prevResources.map((r) =>
        r.id === id ? { ...r, available: !r.available } : r
      )
    );
  };

  // Filtering logic
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = filterType === "all" || resource.type === filterType;
    const matchesAvailability =
      filterAvailability === "all" ||
      (filterAvailability === "available" && resource.available) ||
      (filterAvailability === "unavailable" && !resource.available);
    const matchesTab = activeTab === "all" || resource.type === activeTab;

    return matchesSearch && matchesType && matchesAvailability && matchesTab;
  });

  // Stats
  const stats = {
    total: resources.length,
    volunteers: resources.filter((r) => r.type === "volunteer").length,
    ngos: resources.filter((r) => r.type === "ngo").length,
    gov: resources.filter((r) => r.type === "gov").length,
    available: resources.filter((r) => r.available).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resource Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage volunteers, NGOs, and government agencies
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4" />
          Add Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Total Resources", value: stats.total },
          {
            label: "Volunteers",
            value: stats.volunteers,
            color: "text-blue-600",
          },
          { label: "NGOs", value: stats.ngos, color: "text-purple-600" },
          { label: "Government", value: stats.gov, color: "text-emerald-600" },
          {
            label: "Available Now",
            value: stats.available,
            color: "text-emerald-600",
          },
        ].map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color ?? ""}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or skills..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(val) =>
                setFilterType(val as ResourceType | "all")
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="volunteer">Volunteers</SelectItem>
                <SelectItem value="ngo">NGOs</SelectItem>
                <SelectItem value="gov">Government</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterAvailability}
              onValueChange={(val) =>
                setFilterAvailability(
                  val as "all" | "available" | "unavailable"
                )
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as ResourceType | "all")}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="volunteer">
            Volunteers ({stats.volunteers})
          </TabsTrigger>
          <TabsTrigger value="ngo">NGOs ({stats.ngos})</TabsTrigger>
          <TabsTrigger value="gov">Government ({stats.gov})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No resources found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResources.map((resource) => {
                    return (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                TYPE_CONFIG[resource.type].color
                              }`}
                            >
                              {TYPE_CONFIG[resource.type].icon}
                            </div>
                            <div>
                              <div className="font-medium">{resource.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Joined{" "}
                                {new Date(
                                  resource.joinedDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={TYPE_CONFIG[resource.type].color}
                          >
                            {TYPE_CONFIG[resource.type].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span>{resource.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>{resource.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {resource.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {resource.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAvailability(resource.id)}
                            className="gap-2"
                          >
                            {resource.available ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-600">
                                  Available
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  Unavailable
                                </span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              Rating:{" "}
                              <span className="font-medium">
                                {resource.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {resource.resolvedIncidents}/
                              {resource.assignedIncidents} resolved
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(resource)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={viewDetailsDialog} onOpenChange={setViewDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
            <DialogDescription>
              Complete information about this resource
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    TYPE_CONFIG[selectedResource.type].color
                  }`}
                >
                  {TYPE_CONFIG[selectedResource.type].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedResource.name}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {TYPE_CONFIG[selectedResource.type].label}
                  </Badge>
                </div>
                <Button
                  variant={selectedResource.available ? "outline" : "default"}
                  onClick={() => toggleAvailability(selectedResource.id)}
                >
                  {selectedResource.available ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Unavailable
                    </>
                  )}
                </Button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedResource.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedResource.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedResource.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(selectedResource.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Skills & Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDetailsDialog(false)}
            >
              Close
            </Button>
            <Button>Assign to Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
