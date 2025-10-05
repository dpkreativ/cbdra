"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/actions/auth";
import { Models } from "node-appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  Calendar,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

/* -----------------------------
   Types
----------------------------- */

interface Volunteer extends Models.User<Models.Preferences> {
  location?: string;
  skills?: string[];
  availability?: boolean;
  joinedDate?: string;
  totalAssignments?: number;
  completedAssignments?: number;
  pendingAssignments?: number;
  rating?: number;
  hoursVolunteered?: number;
  badges?: string[];
}

/* -----------------------------
   Component
----------------------------- */

export default function VolunteerDashboardPage() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const user = await getUser();
        if (user) {
          // extend user with mock fields until DB integration
          setVolunteer({
            ...user,
            location: "Atlanta, Georgia", // mock fallback
            skills: ["First Aid", "Search & Rescue"],
            availability: true,
            joinedDate: user.$createdAt,
            totalAssignments: 12,
            completedAssignments: 10,
            pendingAssignments: 2,
            rating: 4.7,
            hoursVolunteered: 85,
            badges: ["First Responder", "Community Hero"],
          });
        }
      } catch (err) {
        console.error("Error fetching volunteer user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-muted-foreground">Loading your dashboard...</p>
    );
  }

  if (!volunteer) {
    return <p className="p-6 text-red-500">No volunteer profile found.</p>;
  }

  const completionRate = volunteer.totalAssignments
    ? Math.round(
        ((volunteer.completedAssignments ?? 0) / volunteer.totalAssignments) *
          100
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {volunteer.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to make a difference in your community today?
          </p>
        </div>
        <Button
          variant={volunteer.availability ? "outline" : "default"}
          size="lg"
          className="shadow-lg"
        >
          {volunteer.availability ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Available
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" />
              Set Available
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assignments
            </CardTitle>
            <Heart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {volunteer.totalAssignments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {volunteer.pendingAssignments} pending response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {completionRate}%
            </div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Volunteered
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {volunteer.hoursVolunteered}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ~{Math.round((volunteer.hoursVolunteered ?? 0) / 12)} days of
              service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Rating
            </CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {volunteer.rating}/5
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {volunteer.completedAssignments} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Your Volunteer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{volunteer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Member since{" "}
                    {new Date(volunteer.joinedDate ?? "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills?.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold mb-2 mt-4">Badges Earned</h3>
              <div className="flex flex-wrap gap-2">
                {volunteer.badges?.map((badge, idx) => (
                  <Badge key={idx} className="bg-amber-100 text-amber-700">
                    <Award className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
