import { Button } from "@/components/ui/button";
import Link from "next/link";
import illustration from "@/assets/images/illustration.svg";
import Image from "next/image";
import {
  HeartHandshake,
  Megaphone,
  Siren,
  TriangleAlert,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="grid md:grid-cols-2 content-center py-10">
        <Image
          src={illustration}
          alt="CBDRA"
          className="w-full max-w-2xl p-5"
        />

        <section className="p-5 flex flex-col justify-center gap-10 md:order-first text-center md:text-left">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
            <div>Stay Safe. Stay</div>
            <div className="text-primary text-4xl md:text-5xl lg:text-6xl mt-3">
              Connected
            </div>
          </h1>
          <p className="text-lg md:text-xl">
            Report emergencies, get real-time help, and support your community.
          </p>

          <div className="grid md:flex gap-5 items-center">
            <Link href="/get-help">
              <Button size="lg">
                <Megaphone />
                Report an Incident
              </Button>
            </Link>

            <Link href="/signup">
              <Button variant="outline" size="lg">
                <HeartHandshake />
                Join as Volunteer
              </Button>
            </Link>
          </div>
        </section>
      </section>

      {/* Quick stats */}
      <section
        className="p-5 flex flex-col gap-10 items-center"
        id="#quick-stats"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Quick stats</h2>
      </section>

      {/* How it works section */}
      <section
        id="how-it-works"
        className="p-5 flex flex-col gap-10 items-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 border rounded-2xl space-y-5">
            <div className="flex items-center gap-3">
              <Megaphone className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-semibold">Report</h3>
            </div>
            <p>Easily report emergencies.</p>
          </div>

          <div className="p-5 border rounded-2xl space-y-5">
            <div className="flex items-center gap-3">
              <Siren className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-semibold">Alert</h3>
            </div>
            <p>Volunteers & responders get notified instantly.</p>
          </div>

          <div className="p-5 border rounded-2xl space-y-5">
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-10 h-10 text-primary" />
              <h3 className="text-2xl font-semibold">Support</h3>
            </div>
            <p>Community comes together to help.</p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="px-5 py-10 flex flex-col gap-10 items-center w-full max-w-[600px] mx-auto"
        id="#cta"
      >
        <h2 className="font-bold text-center text-2xl md:text-3xl">
          Be a part of the solution
        </h2>
        <Link href="/signup" className="w-full">
          <Button size="lg" className="w-full p-10">
            <HeartHandshake />
            Join as Volunteer
          </Button>
        </Link>
      </section>
    </>
  );
}
