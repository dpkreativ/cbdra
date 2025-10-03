import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { AdminHeader } from "@/components/layout/header";
import { AdminSidebar } from "@/components/layout/sidebar-nav";
import { getUser, signout } from "@/actions/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminHeader user={user} signout={signout} />
        <SidebarProvider>
          <AdminSidebar />
          <main className="overflow-y-auto p-5 md:p-8 space-y-8 w-full">
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
