import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import Image from "next/image";
import mascot from "@/assets/images/mascot-1.svg";

export default async function Page() {
  return (
    <div className="px-5 py-10 w-full max-w-md mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Image src={mascot} alt="Mascot" className="w-5" />

          <h2 className="text-2xl font-bold">Create Your Account</h2>
        </div>
        <p className="text-muted-foreground">
          Join our community and help make a difference
        </p>
      </div>

      {/* Form */}
      <SignupForm />

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          className="text-primary underline font-semibold hover:no-underline"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
