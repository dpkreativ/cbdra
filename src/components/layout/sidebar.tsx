import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  return (
    <aside className="hidden p-5 pl-0 w-full max-w-1/5 md:flex flex-col gap-3">
      <Link href="/dashboard" className="px-5 py-3 rounded-r-xl bg-accent">
        Dashboard
      </Link>
      <Link href="/dashboard/resources" className="px-5 py-3 rounded-r-xl">
        Resources
      </Link>
      <Link href="/dashboard/users" className="px-5 py-3 rounded-r-xl">
        Users
      </Link>
    </aside>
  );
}

export function UserSidebar() {
  return (
    <aside className="hidden p-5 pl-0 w-full max-w-1/5 md:flex flex-col">
      <Link href="/user/dashboard" className="px-5 py-3 rounded-r-xl">
        <Button variant="ghost" className="w-full justify-start">
          Dashboard
        </Button>
      </Link>
      <Link href="/user/get-help" className="px-5 py-3 rounded-r-xl">
        <Button variant="ghost" className="w-full justify-start">
          Report an Incident
        </Button>
      </Link>
      <Link href="/user/my-reports" className="px-5 py-3 rounded-r-xl">
        <Button variant="ghost" className="w-full justify-start">
          My Reports
        </Button>
      </Link>
    </aside>
  );
}
