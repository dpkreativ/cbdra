"use client";

import { useState } from "react";
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
import type { LucideIcon } from "lucide-react";

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
  icon: LucideIcon;
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
    phone: "+1 404 123 4567",
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
    phone: "+1 404 987 6543",
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
    phone: "+1 470 321 9876",
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
    name: "Atlanta Fire Service",
    email: "fire@atlanta.gov",
    phone: "+1 404 555 7890",
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
    icon: Heart,
    color: "text-blue-600 bg-blue-100",
  },
  ngo: {
    label: "NGO",
    icon: Building,
    color: "text-purple-600 bg-purple-100",
  },
  gov: {
    label: "Government",
    icon: Shield,
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
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [viewDetailsDialog, setViewDetailsDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter logic
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

  const handleViewDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setViewDetailsDialog(true);
  };

  const toggleAvailability = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, available: !r.available } : r))
    );
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-600" />
              Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.volunteers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              NGOs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.ngos}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Government
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.gov}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Available Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.available}
            </div>
          </CardContent>
        </Card>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
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
              onValueChange={setFilterAvailability}
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

      {/* Tabs + Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                  <TableHead>Skills/Services</TableHead>
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
                    const TypeIcon = TYPE_CONFIG[resource.type].icon;
                    return (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                TYPE_CONFIG[resource.type].color
                              }`}
                            >
                              <TypeIcon className="w-4 h-4" />
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
                              <span className="truncate max-w-[150px]">
                                {resource.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              {resource.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {resource.skills.slice(0, 2).map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {resource.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{resource.skills.length - 2}
                              </Badge>
                            )}
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
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Rating:
                              </span>{" "}
                              <span className="font-medium">
                                {resource.rating}/5
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

      {/* View Details Dialog */}
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
              {/* Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    TYPE_CONFIG[selectedResource.type].color
                  }`}
                >
                  {(() => {
                    const Icon = TYPE_CONFIG[selectedResource.type].icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
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

              {/* Details Grid */}
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
                  <p className="text-sm text-muted-foreground">Joined Date</p>
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
                  {selectedResource.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {selectedResource.assignedIncidents}
                  </p>
                  <p className="text-sm text-muted-foreground">Assigned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {selectedResource.resolvedIncidents}
                  </p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {selectedResource.rating}
                  </p>
                  <p className="text-sm text-muted-foreground">Rating</p>
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
