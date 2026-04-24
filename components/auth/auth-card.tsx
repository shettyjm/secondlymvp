import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";

  return (
    <div className="mx-auto max-w-md py-12">
      <Card className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-teal">
            {isSignup ? "Create account" : "Welcome back"}
          </p>
          <h1 className="text-3xl font-semibold text-ink">
            {isSignup ? "Start a new case" : "Sign in to your account"}
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Replace this form with Supabase Auth UI or server actions once your
            project keys are wired.
          </p>
        </div>
        <form className="space-y-4">
          {isSignup && <Input placeholder="Full name" />}
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full" type="submit">
            {isSignup ? "Create account" : "Login"}
          </Button>
        </form>
        <p className="text-sm text-slate-500">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-ocean"
          >
            {isSignup ? "Login" : "Sign up"}
          </Link>
        </p>
      </Card>
    </div>
  );
}
