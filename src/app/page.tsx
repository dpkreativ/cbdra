import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 w-full max-w-[1200px] mx-auto">
      {/* Hero section */}
      <section className="p-5 flex flex-col justify-center gap-5 h-max min-h-[300px]">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
          Stay Safe. Stay Connected
        </h1>
        <p>
          Report emergencies, get real-time help, and support your community.
        </p>

        <div className="flex gap-5 items-center">
          <Link href="/get-help">
            <Button size="lg" className="cursor-pointer">
              Report an Incident
            </Button>
          </Link>

          <Link href="/signup">
            <Button variant="outline" size="lg" className="cursor-pointer">
              Join as Volunteer
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick stats */}
      <section className="p-5"></section>

      {/* How it works section */}
      <section className="p-5 flex flex-col gap-5 items-center">
        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 border rounded-2xl">
            <h3 className="text-xl font-semibold">Report</h3>
            <p>Easily report emergencies.</p>
          </div>

          <div className="p-5 border rounded-2xl">
            <h3 className="text-xl font-semibold">Alert</h3>
            <p>Volunteers & responders get notified instantly.</p>
          </div>

          <div className="p-5 border rounded-2xl">
            <h3 className="text-xl font-semibold">Support</h3>
            <p>Community comes together to help</p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="flex flex-col gap-5 items-center">
        <h2 className="font-bold text-center text-2xl md:text-3xl">
          Be a part of the solution
        </h2>
        <Link href="/signup">
          <Button size="lg" className="cursor-pointer">
            Join as Volunteer
          </Button>
        </Link>
      </section>
    </main>
  );
}
