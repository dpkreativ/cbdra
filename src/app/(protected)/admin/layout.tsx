import { AdminHeader } from "@/components/layout/header";
import { AdminSidebar } from "@/components/layout/sidebar-nav";
import { getUser, signout } from "@/actions/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { LayoutWrapper } from "@/components/layout";

export const metadata: Metadata = {
  title: "CBDRA - Admin",
  description: "Get the help you need during emergencies.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <LayoutWrapper>
      <AdminHeader user={user} signout={signout} />
      <SidebarProvider>
        <AdminSidebar />
        <main className="overflow-y-auto p-5 md:p-8 space-y-8 w-full">
          {children}
        </main>
        <Toaster />
      </SidebarProvider>
    </LayoutWrapper>
  );
}
