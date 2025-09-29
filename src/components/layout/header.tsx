import { Button } from "@/components/ui/button";
import Image from "next/image";
import mascot from "@/assets/images/mascot-1.svg";
import Link from "next/link";
import { Models } from "node-appwrite";
import { Icon } from "@/components/ui/icon";

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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Icon icon="iconamoon:search" width="24" height="24" />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon icon="hugeicons:notification-01" width="24" height="24" />
          </Button>
          <Button variant="ghost">
            <Icon icon="solar:user-outline" width="24" height="24" />
            <p>{user?.name}</p>
          </Button>
          <Button onClick={signout} size="icon" variant="ghost">
            <Icon icon="material-symbols:logout" width="24" height="24" />
          </Button>
        </div>
      </div>
    </header>
  );
}
