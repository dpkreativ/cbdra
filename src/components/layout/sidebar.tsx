import Link from "next/link";

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
  return <aside></aside>;
}
