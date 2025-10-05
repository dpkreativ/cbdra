"use client";

import { useState, useEffect } from "react";
import { Models } from "node-appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Edit, Calendar, CheckCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* ----------------------------
   Types
----------------------------- */
interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface Certification {
  name: string;
  issuedBy: string;
  year: string;
}

interface Preferences {
  maxDistance: number;
  notifyEmail: boolean;
  notifySMS: boolean;
  preferredIncidents: string[];
}

interface VolunteerProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  availability: boolean;
  joinedDate: string;
  emergencyContact: EmergencyContact;
  certifications: Certification[];
  preferences: Preferences;
}

interface VolunteerBadge {
  name: string;
  icon: string;
  earnedDate: string;
}

interface Review {
  incident: string;
  rating: number;
  feedback: string;
  date: string;
}

interface VolunteerStats {
  totalAssignments: number;
  completedAssignments: number;
  hoursVolunteered: number;
  rating: number;
  badges: VolunteerBadge[];
  recentReviews: Review[];
}

/* ----------------------------
   Component
----------------------------- */
export default function VolunteerProfilePage() {
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>("");

  const completionRate =
    stats && stats.totalAssignments > 0
      ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100)
      : 0;

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const user: Models.User<Models.Preferences> | null = await getUser();

        if (user) {
          const volunteer: VolunteerProfile = {
            name: user.name ?? "Volunteer",
            email: user.email ?? "volunteer@example.com",
            phone: user.phone ?? "+1 404-555-0000",
            location: "Atlanta, Georgia",
            bio: "Passionate about helping the community during emergencies.",
            skills: ["First Aid", "Search & Rescue"],
            availability: true,
            joinedDate: user.$createdAt ?? new Date().toISOString(),
            emergencyContact: {
              name: "Default Contact",
              phone: "+1 404-555-1111",
              relationship: "Friend",
            },
            certifications: [
              {
                name: "First Aid Certificate",
                issuedBy: "Red Cross",
                year: "2023",
              },
            ],
            preferences: {
              maxDistance: 20,
              notifyEmail: true,
              notifySMS: true,
              preferredIncidents: ["water", "fire"],
            },
          };

          setProfile(volunteer);

          setStats({
            totalAssignments: 12,
            completedAssignments: 10,
            hoursVolunteered: 80,
            rating: 4.7,
            badges: [
              { name: "First Responder", icon: "🚨", earnedDate: "2024-02-15" },
              { name: "Community Hero", icon: "🦸", earnedDate: "2024-05-20" },
            ],
            recentReviews: [
              {
                incident: "Flood Response - Atlanta",
                rating: 5,
                feedback: "Quick and effective response!",
                date: "2024-09-20",
              },
              {
                incident: "Building Fire - Decatur",
                rating: 4.5,
                feedback: "Handled the situation very well.",
                date: "2024-10-01",
              },
            ],
          });

          setTempSkills(volunteer.skills);
        }
      } catch (err) {
        console.error("Error fetching volunteer profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = (): void => {
    if (!profile) return;
    console.log("Saving profile:", profile);
    toast.success("Profile updated successfully!");
    setEditMode(false);
  };

  const handleAddSkill = (): void => {
    if (newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
      setTempSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string): void => {
    setTempSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSaveSkills = (): void => {
    if (!profile) return;
    setProfile({ ...profile, skills: tempSkills });
    toast.success("Skills updated successfully!");
    setSkillDialogOpen(false);
  };

  const toggleAvailability = (): void => {
    if (!profile) return;
    const newAvailability = !profile.availability;
    setProfile({ ...profile, availability: newAvailability });
    toast.success(
      newAvailability
        ? "You are now available for assignments"
        : "You are now unavailable for assignments"
    );
  };

  if (!profile || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your volunteer information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={profile.availability ? "outline" : "default"}
            onClick={toggleAvailability}
          >
            {profile.availability ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Available
              </>
            ) : (
              "Set Available"
            )}
          </Button>
          {!editMode && (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {completionRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Hours Volunteered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.hoursVolunteered}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Your Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.rating}/5
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  disabled={!editMode}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Member since{" "}
                  {new Date(profile.joinedDate).toLocaleDateString()}
                </div>
              </div>

              {editMode && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills & Expertise</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSkillDialogOpen(true)}
              >
                <Edit className="w-4 h-4" />
                Edit Skills
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.badges.map((badge: VolunteerBadge, idx: number) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 flex items-start gap-4"
                  >
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Earned on{" "}
                        {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Reviews</CardTitle>
                <div className="flex items-center gap-1">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{stats.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">/ 5.0</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.recentReviews.map((review: Review, idx: number) => (
                  <div
                    key={idx}
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{review.incident}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className={
                                i <= Math.floor(review.rating)
                                  ? "text-amber-500"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-muted-foreground">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      &ldquo;{review.feedback}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Skills Dialog */}
      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Skills</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button size="icon" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tempSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 text-sm"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-xs text-muted-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSkills}>Save Skills</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
