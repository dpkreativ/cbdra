import { UserHeader } from "@/components/layout/header";
import { getUser, signout } from "@/actions/auth";
import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "@/app/globals.css";
import { UserSidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Based Disaster Response App",
  description: "Get the help you need during emergencies.",
};

export default async function UserLayout({
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
        <UserHeader user={user} signout={signout} />
        <div className="flex h-full">
          <UserSidebar />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
