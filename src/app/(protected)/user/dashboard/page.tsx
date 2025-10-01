import { getUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Megaphone, FileText } from "lucide-react";
import { IncidentsStats } from "@/components/dashboard/incidents/user-view";

export default async function UserDashboardPage() {
  const user = await getUser();

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

      {/* Stats and Activity */}
      <IncidentsStats />
    </main>
  );
}
