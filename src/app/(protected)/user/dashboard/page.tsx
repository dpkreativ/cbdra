import { getUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserDashboardPage() {
  const user = await getUser();

  return (
    <main className="p-5 space-y-10">
      <section className="flex flex-col gap-10">
        {/* Welcome message */}
        <p className="text-xl font-semibold">Welcome back, {user?.name}!</p>

        <div className="grid md:flex gap-5">
          <Link href="/user/get-help">
            <Button className="py-5">Report an Incident</Button>
          </Link>
          <Link href="/user/my-reports">
            <Button className="py-5">My Reports</Button>
          </Link>
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
