import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import "leaflet/dist/leaflet.css";
import mascot from "@/assets/images/mascot-1.svg";
import Image from "next/image";
import Link from "next/link";
import { getUser, signout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b">
          <div className="p-5 w-full flex items-center justify-between gap-5">
            <Link href="/" className="flex items-center gap-2">
              <Image src={mascot} alt="Mascot" className="w-5" />
              <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
                CBDRA
              </h1>
            </Link>

            <div className="flex items-center gap-2">
              <p>{user?.name}</p>
              <Button onClick={signout} size="icon" variant="ghost">
                <LogOut />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex h-full">
          <aside className="p-5 pl-0 w-full max-w-1/5 flex flex-col gap-5">
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-r-xl bg-accent"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/resources"
              className="px-5 py-3 rounded-r-xl"
            >
              Resources
            </Link>
            <Link href="/dashboard/users" className="px-5 py-3 rounded-r-xl">
              Users
            </Link>
          </aside>
          {children}
        </div>
      </body>
    </html>
  );
}
