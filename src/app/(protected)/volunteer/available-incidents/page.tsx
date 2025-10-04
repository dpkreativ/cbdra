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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  AlertCircle,
  Search,
  Heart,
  Filter,
  Navigation,
  Users,
} from "lucide-react";

const MOCK_INCIDENTS = [
  {
    id: "1",
    incidentType: "Flood",
    category: "water",
    description:
      "Flash flooding in Eleme community affecting 50+ families. Need help with evacuation and distribution of relief materials.",
    location: "Eleme, Rivers State",
    coordinates: { lat: 4.7849, lng: 7.1129 },
    urgency: "high",
    postedAt: "2024-10-04T07:45:00Z",
    requiredSkills: ["Search & Rescue", "First Aid", "Logistics"],
    estimatedDuration: "6-8 hours",
    distance: "12 km away",
    volunteersNeeded: 5,
    volunteersAssigned: 2,
    postedBy: "Emergency Response Team",
    matchScore: 95, // How well it matches volunteer skills
  },
  {
    id: "2",
    incidentType: "Medical Emergency",
    category: "biological",
    description:
      "Community health awareness needed after food poisoning outbreak in local market area.",
    location: "Diobu, Port Harcourt",
    coordinates: { lat: 4.797, lng: 7.0235 },
    urgency: "medium",
    postedAt: "2024-10-04T09:00:00Z",
    requiredSkills: ["First Aid", "Community Outreach", "Health Education"],
    estimatedDuration: "3-4 hours",
    distance: "8 km away",
    volunteersNeeded: 3,
    volunteersAssigned: 1,
    postedBy: "Community Health Initiative",
    matchScore: 88,
  },
  {
    id: "3",
    incidentType: "Building Collapse",
    category: "man-made",
    description:
      "Partial building collapse at construction site. Search and rescue support needed urgently.",
    location: "Trans Amadi, Port Harcourt",
    coordinates: { lat: 4.8156, lng: 7.0498 },
    urgency: "high",
    postedAt: "2024-10-04T08:30:00Z",
    requiredSkills: ["Search & Rescue", "First Aid", "Emergency Response"],
    estimatedDuration: "8-10 hours",
    distance: "15 km away",
    volunteersNeeded: 6,
    volunteersAssigned: 3,
    postedBy: "Fire Department",
    matchScore: 78,
  },
  {
    id: "4",
    incidentType: "Traffic Accident",
    category: "man-made",
    description:
      "Multiple vehicle collision on major highway. First aid assistance required.",
    location: "East-West Road, Port Harcourt",
    coordinates: { lat: 4.8242, lng: 7.0336 },
    urgency: "medium",
    postedAt: "2024-10-04T10:15:00Z",
    requiredSkills: ["First Aid", "Traffic Management"],
    estimatedDuration: "2-3 hours",
    distance: "6 km away",
    volunteersNeeded: 2,
    volunteersAssigned: 0,
    postedBy: "Traffic Authority",
    matchScore: 85,
  },
  {
    id: "5",
    incidentType: "Community Outreach",
    category: "other",
    description:
      "Relief material distribution for flood victims. Need volunteers for logistics support.",
    location: "Ogbogoro, Port Harcourt",
    coordinates: { lat: 4.8893, lng: 6.9547 },
    urgency: "low",
    postedAt: "2024-10-04T11:00:00Z",
    requiredSkills: ["Logistics", "Community Outreach"],
    estimatedDuration: "4-5 hours",
    distance: "20 km away",
    volunteersNeeded: 4,
    volunteersAssigned: 1,
    postedBy: "Red Cross NGO",
    matchScore: 65,
  },
];

const URGENCY_CONFIG = {
  high: {
    label: "Critical",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: AlertCircle,
  },
  medium: {
    label: "Moderate",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  low: {
    label: "Minor",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Clock,
  },
};

export default function VolunteerAvailableIncidentsPage() {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [filterDistance, setFilterDistance] = useState("all");
  const [sortBy, setSortBy] = useState("match"); // match, urgency, distance, time

  // Filter and sort incidents
  const filteredIncidents = incidents
    .filter((incident) => {
      const matchesSearch =
        incident.incidentType
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUrgency =
        filterUrgency === "all" || incident.urgency === filterUrgency;

      const matchesDistance =
        filterDistance === "all" ||
        (filterDistance === "near" && parseInt(incident.distance) <= 10) ||
        (filterDistance === "medium" &&
          parseInt(incident.distance) > 10 &&
          parseInt(incident.distance) <= 20) ||
        (filterDistance === "far" && parseInt(incident.distance) > 20);

      return matchesSearch && matchesUrgency && matchesDistance;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "urgency") {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      if (sortBy === "distance")
        return parseInt(a.distance) - parseInt(b.distance);
      if (sortBy === "time")
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      return 0;
    });

  const handleViewDetails = (incident: any) => {
    setSelectedIncident(incident);
    setViewDetailsDialog(true);
  };

  const handleAcceptIncident = (incidentId: string) => {
    // TODO: API call to accept incident
    console.log("Accepting incident:", incidentId);
    setViewDetailsDialog(false);
  };

  const handleGetDirections = (coords: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    window.open(url, "_blank");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Available Incidents</h1>
        <p className="text-muted-foreground mt-1">
          Find incidents matching your skills and help your community
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {incidents.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {incidents.filter((i) => i.urgency === "high").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Best Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {incidents.filter((i) => i.matchScore >= 80).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Volunteers Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {incidents.reduce(
                (sum, i) => sum + (i.volunteersNeeded - i.volunteersAssigned),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="high">Critical</SelectItem>
                <SelectItem value="medium">Moderate</SelectItem>
                <SelectItem value="low">Minor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDistance} onValueChange={setFilterDistance}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="near">Within 10 km</SelectItem>
                <SelectItem value="medium">10-20 km</SelectItem>
                <SelectItem value="far">20+ km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "match" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("match")}
              >
                Best Match
              </Button>
              <Button
                variant={sortBy === "urgency" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("urgency")}
              >
                Urgency
              </Button>
              <Button
                variant={sortBy === "distance" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("distance")}
              >
                Distance
              </Button>
              <Button
                variant={sortBy === "time" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("time")}
              >
                Latest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No incidents match your filters. Try adjusting your search
              criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const UrgencyIcon = URGENCY_CONFIG[incident.urgency].icon;
            const spotsRemaining =
              incident.volunteersNeeded - incident.volunteersAssigned;
            return (
              <Card
                key={incident.id}
                className="border-2 hover:border-primary transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {incident.incidentType}
                          </h3>
                          {incident.matchScore >= 80 && (
                            <Badge className="bg-emerald-100 text-emerald-700">
                              {incident.matchScore}% Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {incident.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={URGENCY_CONFIG[incident.urgency].color}
                      >
                        <UrgencyIcon className="w-3 h-3 mr-1" />
                        {URGENCY_CONFIG[incident.urgency].label}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{incident.distance}</div>
                          <div className="text-xs text-muted-foreground">
                            {incident.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {incident.estimatedDuration}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Est. duration
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {spotsRemaining} spot
                            {spotsRemaining !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            remaining
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {formatTimeAgo(incident.postedAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Posted
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{incident.postedBy}</div>
                        <div className="text-xs text-muted-foreground">
                          Posted by
                        </div>
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div>
                      <span className="text-sm font-medium">
                        Required Skills:{" "}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {incident.requiredSkills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {incident.volunteersAssigned} of{" "}
                          {incident.volunteersNeeded} volunteers assigned
                        </span>
                        <span>
                          {Math.round(
                            (incident.volunteersAssigned /
                              incident.volunteersNeeded) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (incident.volunteersAssigned /
                                incident.volunteersNeeded) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button onClick={() => handleAcceptIncident(incident.id)}>
                        <Heart className="w-4 h-4 mr-2" />
                        Accept Assignment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(incident)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleGetDirections(incident.coordinates)
                        }
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialog} onOpenChange={setViewDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
            <DialogDescription>
              Complete information about this incident
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedIncident.incidentType}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {selectedIncident.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={URGENCY_CONFIG[selectedIncident.urgency].color}
                >
                  {URGENCY_CONFIG[selectedIncident.urgency].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedIncident.location}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedIncident.distance}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Duration
                  </p>
                  <p className="font-medium">
                    {selectedIncident.estimatedDuration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posted By</p>
                  <p className="font-medium">{selectedIncident.postedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-medium">
                    {formatTimeAgo(selectedIncident.postedAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.requiredSkills.map(
                    (skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Volunteer Status</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {selectedIncident.volunteersAssigned}
                    </p>
                    <p className="text-xs text-muted-foreground">Assigned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedIncident.volunteersNeeded -
                        selectedIncident.volunteersAssigned}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Still Needed
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">
                      {selectedIncident.matchScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
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
            <Button
              variant="outline"
              onClick={() =>
                selectedIncident &&
                handleGetDirections(selectedIncident.coordinates)
              }
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button
              onClick={() =>
                selectedIncident && handleAcceptIncident(selectedIncident.id)
              }
            >
              <Heart className="w-4 h-4 mr-2" />
              Accept Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
