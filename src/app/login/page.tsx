import { createSession } from "@/auth/actions";
import { LoginForm } from "@/components/auth/login-form";

export default function Page() {
  return (
    <main className="px-5 py-20">
      <div className="w-full max-w-md mx-auto flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Hey there!</h1>
        <h2 className="text-xl">Welcome to CBDRA</h2>
        <p className="text-muted-foreground">
          Please login to your account to continue.
        </p>
        <LoginForm action={createSession} />
      </div>
    </main>
  );
}
