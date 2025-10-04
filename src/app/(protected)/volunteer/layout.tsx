import { VolunteerHeader } from "@/components/layout/header";
import { getUser, signout } from "@/actions/auth";
import type { Metadata } from "next";
import { VolunteerSidebar } from "@/components/layout/sidebar-nav";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LayoutWrapper } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  return {
    title: user?.name ? `CBDRA - ${user.name}` : "CBDRA - Volunteer",
    description: "Make a difference in your community during emergencies.",
  };
}

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <LayoutWrapper>
      <VolunteerHeader user={user} signout={signout} />
      <SidebarProvider>
        <VolunteerSidebar />
        <main className="p-5 md:p-8 space-y-8 w-full">{children}</main>
        <Toaster />
      </SidebarProvider>
    </LayoutWrapper>
  );
}
