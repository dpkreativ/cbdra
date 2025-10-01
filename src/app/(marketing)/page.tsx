import { Button } from "@/components/ui/button";
import Link from "next/link";
import illustration from "@/assets/images/illustration.svg";
import Image from "next/image";
import {
  HeartHandshake,
  Megaphone,
  Siren,
  Shield,
  Clock,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero section with gradient background */}
      <section className="relative py-10 md:py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 -z-10" />

        <div className="w-full max-w-[1200px] mx-auto grid md:grid-cols-2 content-center py-16">
          <div className="order-2 md:order-1 p-5 flex flex-col justify-center gap-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium w-fit mx-auto md:mx-0">
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ Community Members
            </div>

            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
              <div>Stay Safe.</div>
              <div>
                Stay <span className="text-primary">Connected</span>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Report emergencies in real-time, connect with volunteers, and get
              the help you need when it matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
              <Link href="/user/get-help" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
                >
                  <Megaphone className="w-5 h-5" />
                  Report an Incident
                </Button>
              </Link>

              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <HeartHandshake className="w-5 h-5" />
                  Join as Volunteer
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold text-primary">2.5K+</div>
                <div className="text-sm text-muted-foreground">
                  Incidents Resolved
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1.2K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Volunteers
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">&lt;15min</div>
                <div className="text-sm text-muted-foreground">
                  Avg Response
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 p-5">
            <Image
              src={illustration}
              alt="CBDRA"
              className="w-full max-w-xl mx-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* How it works - Enhanced */}
      <section id="how-it-works" className="p-5 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get help in three simple steps. Our community-driven platform
              connects you with local responders instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-6 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary font-bold text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Report Incident</h3>
                </div>
                <p className="text-muted-foreground">
                  Quickly report emergencies with photos, videos, and precise
                  location. Our intuitive form makes it easy.
                </p>
              </div>
            </div>

            <div className="relative p-6 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary font-bold text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">Instant Alert</h3>
                </div>
                <p className="text-muted-foreground">
                  Nearby volunteers, NGOs, and emergency services receive
                  instant notifications about your incident.
                </p>
              </div>
            </div>

            <div className="relative p-6 bg-background rounded-2xl border shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary font-bold text-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Get Support</h3>
                </div>
                <p className="text-muted-foreground">
                  Community responders arrive quickly. Track their progress in
                  real-time until help arrives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="p-5 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose CBDRA?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of community members and responders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold">Fast Response</h3>
              <p className="text-sm text-muted-foreground">
                Average response time under 15 minutes
              </p>
            </div>

            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold">Verified Responders</h3>
              <p className="text-sm text-muted-foreground">
                All volunteers are background-checked
              </p>
            </div>

            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Powered by local volunteers who care
              </p>
            </div>

            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Megaphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold">Real-Time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Track incident status from report to resolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section - Enhanced */}
      <section className="relative px-5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 -z-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 -z-10" />

        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of volunteers helping their communities during
            emergencies. Your support can save lives.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="ghost"
              className="shadow-xl hover:shadow-2xl transition-all"
            >
              <HeartHandshake className="w-5 h-5" />
              Become a Volunteer
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
