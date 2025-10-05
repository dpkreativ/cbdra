import { UserHeader } from "@/components/layout/header";
import { getUser, signout } from "@/actions/auth";
import type { Metadata } from "next";
import { UserSidebar } from "@/components/layout/sidebar-nav";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LayoutWrapper } from "@/components/layout";

// ✅ dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  return {
    title: user?.name ? `CBDRA - ${user.name}` : "CBDRA - User",
    description: "Get the help you need during emergencies.",
  };
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <LayoutWrapper>
      <UserHeader user={user} signout={signout} />
      <SidebarProvider>
        <UserSidebar />
        <main className="p-5 md:p-8 space-y-8 w-full">{children}</main>
        <Toaster />
      </SidebarProvider>
    </LayoutWrapper>
  );
}
