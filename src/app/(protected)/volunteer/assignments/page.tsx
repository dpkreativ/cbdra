"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Navigation,
  Phone,
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

/* ----------------------------
   Types
----------------------------- */
type AssignmentStatus = "pending" | "in-progress" | "completed";

interface Coordinates {
  lat: number;
  lng: number;
}

interface BaseAssignment {
  id: string;
  incidentType: string;
  category: string;
  description: string;
  location: string;
  urgency: keyof typeof URGENCY_CONFIG;
  status: AssignmentStatus;
  assignedAt: string;
}

interface ActiveAssignment extends BaseAssignment {
  coordinates: Coordinates;
  acceptedAt?: string;
  requiredSkills: string[];
  estimatedDuration: string;
  distance: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  otherVolunteers: string[];
  notes?: string;
}

interface CompletedAssignment extends BaseAssignment {
  completedAt: string;
  duration: string;
  rating: number;
  feedback?: string;
}

/* ----------------------------
   Urgency Config
----------------------------- */
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
    icon: CheckCircle,
  },
};

/* ----------------------------
   Mock Data (Atlanta, Georgia)
----------------------------- */
const MOCK_ASSIGNMENTS: ActiveAssignment[] = [
  {
    id: "1",
    incidentType: "Flood",
    category: "water",
    description:
      "Flash flooding in Atlanta neighborhood affecting 50+ families.",
    location: "Atlanta, Georgia",
    coordinates: { lat: 33.749, lng: -84.388 },
    urgency: "high",
    status: "in-progress",
    assignedAt: "2024-10-04T08:30:00Z",
    acceptedAt: "2024-10-04T08:35:00Z",
    requiredSkills: ["Search & Rescue", "First Aid"],
    estimatedDuration: "4-6 hours",
    distance: "5 miles away",
    contactPerson: "Sarah Johnson",
    contactPhone: "+1 404-555-1234",
    contactEmail: "sarah.johnson@example.com",
    otherVolunteers: ["Jane Smith", "Michael Lee"],
    notes: "Bring water purification tablets if available.",
  },
  {
    id: "2",
    incidentType: "Building Fire",
    category: "fire",
    description: "Small fire in residential building, evacuation assistance.",
    location: "Decatur, Georgia",
    coordinates: { lat: 33.7748, lng: -84.2963 },
    urgency: "medium",
    status: "in-progress",
    assignedAt: "2024-10-03T14:20:00Z",
    acceptedAt: "2024-10-03T14:25:00Z",
    requiredSkills: ["First Aid", "Community Outreach"],
    estimatedDuration: "2-3 hours",
    distance: "7 miles away",
    contactPerson: "Chief Roberts",
    contactPhone: "+1 404-555-5678",
    contactEmail: "firedept@decatur.gov",
    otherVolunteers: ["Sarah Wilson"],
    notes: "Meet at the fire station first.",
  },
  {
    id: "3",
    incidentType: "Medical Emergency",
    category: "biological",
    description: "Community health support after food poisoning outbreak.",
    location: "Buckhead, Atlanta",
    coordinates: { lat: 33.8487, lng: -84.3733 },
    urgency: "medium",
    status: "pending",
    assignedAt: "2024-10-04T09:00:00Z",
    requiredSkills: ["First Aid", "Community Outreach"],
    estimatedDuration: "3-4 hours",
    distance: "10 miles away",
    contactPerson: "Dr. Chidi Nwosu",
    contactPhone: "+1 404-555-9012",
    contactEmail: "dr.nwosu@health.org",
    otherVolunteers: ["John Eke", "Grace Okoro"],
    notes: "Educational materials will be provided.",
  },
];

const COMPLETED_ASSIGNMENTS: CompletedAssignment[] = [
  {
    id: "4",
    incidentType: "Traffic Accident",
    category: "man-made",
    description: "Minor traffic accident requiring first aid support.",
    location: "Midtown, Atlanta",
    urgency: "low",
    status: "completed",
    assignedAt: "2024-10-02T10:15:00Z",
    completedAt: "2024-10-02T12:45:00Z",
    duration: "2h 25m",
    rating: 5,
    feedback: "Excellent response time and professionalism. Very helpful!",
  },
  {
    id: "5",
    incidentType: "Flood",
    category: "water",
    description: "Emergency evacuation support during heavy rainfall.",
    location: "East Point, Georgia",
    urgency: "high",
    status: "completed",
    assignedAt: "2024-09-28T06:00:00Z",
    completedAt: "2024-09-28T14:30:00Z",
    duration: "8h 20m",
    rating: 4.5,
    feedback: "Great work coordinating with other volunteers. Thank you!",
  },
];

/* ----------------------------
   Component
----------------------------- */
export default function VolunteerAssignmentsPage() {
  const [activeAssignments, setActiveAssignments] =
    useState<ActiveAssignment[]>(MOCK_ASSIGNMENTS);
  const [completedAssignments] = useState<CompletedAssignment[]>(
    COMPLETED_ASSIGNMENTS
  );
  const [selectedAssignment, setSelectedAssignment] =
    useState<ActiveAssignment | null>(null);
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);
  const [completeDialog, setCompleteDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | "all">(
    "all"
  );

  // ✅ Fix: Type-safe handler for Select
  const handleStatusChange = (value: string) => {
    if (value === "all" || value === "pending" || value === "in-progress") {
      setFilterStatus(value);
    }
  };

  const filteredActive = activeAssignments.filter(
    (a) => filterStatus === "all" || a.status === filterStatus
  );

  const stats = {
    active: activeAssignments.length,
    pending: activeAssignments.filter((a) => a.status === "pending").length,
    inProgress: activeAssignments.filter((a) => a.status === "in-progress")
      .length,
    completed: completedAssignments.length,
  };

  const handleViewDetails = (assignment: ActiveAssignment): void => {
    setSelectedAssignment(assignment);
    setViewDetailsDialog(true);
  };

  const handleAcceptAssignment = (assignmentId: string): void => {
    setActiveAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: "in-progress",
              acceptedAt: new Date().toISOString(),
            }
          : a
      )
    );
    setViewDetailsDialog(false);
  };

  const handleOpenComplete = (assignment: ActiveAssignment): void => {
    setSelectedAssignment(assignment);
    setCompleteDialog(true);
    setViewDetailsDialog(false);
  };

  const handleCompleteAssignment = (): void => {
    if (!selectedAssignment) return;
    setActiveAssignments((prev) =>
      prev.filter((a) => a.id !== selectedAssignment.id)
    );
    setCompleteDialog(false);
    setCompletionNotes("");
  };

  const handleGetDirections = (coords: Coordinates): void => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    window.open(url, "_blank");
  };

  const formatTimeAgo = (dateString: string): string => {
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
        <h1 className="text-3xl font-bold">My Assignments</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your volunteer assignments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Active Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>

        {/* Active Assignments */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Select value={filterStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {filteredActive.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No active assignments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredActive.map((assignment) => {
                const UrgencyIcon = URGENCY_CONFIG[assignment.urgency].icon;
                return (
                  <Card
                    key={assignment.id}
                    className="border-2 hover:border-primary transition-colors"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {assignment.incidentType}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {assignment.description}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={URGENCY_CONFIG[assignment.urgency].color}
                          >
                            <UrgencyIcon className="w-3 h-3 mr-1" />
                            {URGENCY_CONFIG[assignment.urgency].label}
                          </Badge>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{assignment.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{assignment.estimatedDuration}</span>
                          </div>
                          <div className="text-muted-foreground">
                            Assigned {formatTimeAgo(assignment.assignedAt)}
                          </div>
                          <div>
                            <Badge
                              variant={
                                assignment.status === "pending"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {assignment.status === "pending"
                                ? "Pending Response"
                                : "In Progress"}
                            </Badge>
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <span className="text-sm font-medium">
                            Required Skills:{" "}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {assignment.requiredSkills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Contact Info */}
                        {assignment.status === "in-progress" && (
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium mb-2">
                              Contact Information
                            </p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                  Contact Person:
                                </span>
                                <span>{assignment.contactPerson}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <a
                                  href={`tel:${assignment.contactPhone}`}
                                  className="text-primary hover:underline"
                                >
                                  {assignment.contactPhone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <a
                                  href={`mailto:${assignment.contactEmail}`}
                                  className="text-primary hover:underline"
                                >
                                  {assignment.contactEmail}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(assignment)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          {assignment.status === "pending" && (
                            <Button
                              onClick={() =>
                                handleAcceptAssignment(assignment.id)
                              }
                            >
                              Accept Assignment
                            </Button>
                          )}
                          {assignment.status === "in-progress" && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleGetDirections(assignment.coordinates)
                                }
                              >
                                <Navigation className="w-4 h-4 mr-2" />
                                Get Directions
                              </Button>
                              <Button
                                onClick={() => handleOpenComplete(assignment)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Complete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Completed Assignments */}
        <TabsContent value="completed" className="space-y-4">
          {completedAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No completed assignments yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {assignment.incidentType}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {assignment.description}
                          </p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Location:
                          </span>
                          <p className="font-medium">{assignment.location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <p className="font-medium">{assignment.duration}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Completed:
                          </span>
                          <p className="font-medium">
                            {new Date(
                              assignment.completedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>
                          <p className="font-medium text-amber-600">
                            ⭐ {assignment.rating}/5
                          </p>
                        </div>
                      </div>

                      {assignment.feedback && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-1">Feedback</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialog} onOpenChange={setViewDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogDescription>
              Complete information about this assignment.
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedAssignment.incidentType}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedAssignment.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-medium">{selectedAssignment.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedAssignment.estimatedDuration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <Badge
                    className={URGENCY_CONFIG[selectedAssignment.urgency].color}
                  >
                    {URGENCY_CONFIG[selectedAssignment.urgency].label}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignment.requiredSkills?.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedAssignment.otherVolunteers && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Other Volunteers Assigned
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.otherVolunteers.map((name, idx) => (
                      <Badge key={idx} variant="outline">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedAssignment.notes && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-1">Additional Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAssignment.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDetailsDialog(false)}
            >
              Close
            </Button>
            {selectedAssignment?.status === "pending" && (
              <Button
                onClick={() => handleAcceptAssignment(selectedAssignment.id)}
              >
                Accept Assignment
              </Button>
            )}
            {selectedAssignment?.status === "in-progress" && (
              <Button
                onClick={() => handleOpenComplete(selectedAssignment)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Mark Complete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Assignment Dialog */}
      <Dialog open={completeDialog} onOpenChange={setCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Assignment</DialogTitle>
            <DialogDescription>
              Please provide any final notes about this assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add completion notes (optional)"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteAssignment}>
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
