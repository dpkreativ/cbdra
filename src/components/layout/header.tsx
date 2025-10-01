import Image from "next/image";
import mascot from "@/assets/images/mascot-1.svg";
import Link from "next/link";
import { Models } from "node-appwrite";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function AdminHeader({
  user,
  signout,
}: {
  user?: Models.User | null;
  signout: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b">
      <div className="p-5 w-full flex items-center justify-between gap-5">
        {/* Logo + Title */}
        <Link href="/admin" className="flex items-center gap-2">
          <Image src={mascot} alt="Mascot" className="w-5" />
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">Admin</h1>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md px-4">
          <div className="relative w-full">
            <Icon
              icon="iconamoon:search"
              width="20"
              height="20"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search incidents or resources..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* User + Notifications */}
        <div className="flex items-center gap-8">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Icon icon="hugeicons:notification-01" width="16" height="16" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>No new alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Icon icon="solar:user-outline" width="16" height="16" />
              <p>{user?.name ?? "Admin"}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={signout}
                className="flex gap-2 items-center cursor-pointer"
              >
                <Icon icon="material-symbols:logout" width="16" height="16" />
                <p>Logout</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 sm:w-80 px-5 py-10 gap-5 font-semibold"
            >
              <Link href="/admin/dashboard">Dashboard</Link>
              <Link href="/admin/incidents">Incidents</Link>
              <Link href="/admin/resources">Resources</Link>
              <Link href="/admin/settings">Settings</Link>
              <Button
                onClick={signout}
                className="mt-5 w-full flex gap-2 items-center"
              >
                <Icon icon="material-symbols:logout" width="16" height="16" />
                Logout
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function UserHeader({
  user,
  signout,
}: {
  user?: Models.User | null;
  signout: () => void;
}) {
  return (
    <header className="sticky w-full top-0 z-50 bg-white/50 backdrop-blur-3xl border-b">
      <div className="p-5 w-full flex items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src={mascot} alt="Mascot" className="w-5" />
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">CBDRA</h1>
        </Link>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md px-4">
          <div className="relative w-full">
            <Icon
              icon="iconamoon:search"
              width="20"
              height="20"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search incidents..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Icon icon="solar:user-outline" width="16" height="16" />
              <p>{user?.name}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem
                onClick={signout}
                className="flex gap-2 items-center cursor-pointer"
              >
                <Icon icon="material-symbols:logout" width="16" height="16" />
                <p>Logout</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Icon icon="hugeicons:notification-01" width="16" height="16" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Notification 1</DropdownMenuItem>
              <DropdownMenuItem>Notification 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function MarketingHeader({ user }: { user?: Models.User | null }) {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/50 backdrop-blur-2xl">
      <div className="p-5 w-full max-w-[1200px] mx-auto flex items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src={mascot} alt="Mascot" className="w-5" />
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">CBDRA</h1>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-10 items-center font-semibold">
          <Link href="/">Home</Link>
          <Link href="/#how-it-works">How it works</Link>
          {user ? (
            <Link href="/user/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg">Get started</Button>
            </Link>
          )}
        </nav>

        {/* Mobile nav */}
        <nav className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Icon icon="mdi:hamburger-menu-back" width="20" height="20" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80 p-12 gap-8">
              <Link href="/">Home</Link>
              <Link href="/#how-it-works">How it works</Link>
              {user ? (
                <Link href="/user/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
              )}
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
