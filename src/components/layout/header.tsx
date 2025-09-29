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

export function AdminHeader() {
  return <header></header>;
}

export function UserHeader({
  user,
  signout,
}: {
  user?: Models.User | null;
  signout: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b">
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
