import { getUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserDashboardPage() {
  const user = await getUser();

  return (
    <main className="p-5 space-y-5">
      <section className="flex flex-col gap-5">
        {/* Welcome message */}
        <p>Welcome back, {user?.name}!</p>

        {/* Quick actions */}
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Link href="/user/get-help">
            <Button className="py-10">Report an Incident</Button>
          </Link>
          <Button className="py-10">My Reports</Button>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold">
          Here&apos;s what&apos;s happening in your community
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
      </section>
    </main>
  );
}
