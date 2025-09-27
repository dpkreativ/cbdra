import { login } from "@/actions/auth";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-5 w-full max-w-md mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-2xl font-bold">Stay Safe. Stay Connected</h1>
        <p>Please login to your account to continue.</p>
      </div>
      <LoginForm action={login} />

      <p className="text-muted-foreground text-center md:text-left">
        Don't have an account?{" "}
        <Link className="text-primary underline font-semibold" href="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
