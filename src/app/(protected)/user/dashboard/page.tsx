// src/app/(protected)/user/dashboard/page.tsx
import { getUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Megaphone,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export default async function UserDashboardPage() {
  const user = await getUser();

  // TODO: Fetch user's incident stats
  const stats = {
    total: 12,
    pending: 3,
    resolved: 9,
    avgResponseTime: "18 min",
  };

  return (
    <main className="p-5 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening in your community today
          </p>
        </div>
        <Link href="/user/get-help">
          <Button size="lg" className="shadow-lg">
            <Megaphone className="w-5 h-5" />
            Report New Incident
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reports
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Being reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.resolved}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Community response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/user/get-help">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Report New Incident
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Need help? Report an emergency or incident in your area
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/user/my-reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                View My Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track status and updates on your submitted reports
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity in Your Area</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening in your community today
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
