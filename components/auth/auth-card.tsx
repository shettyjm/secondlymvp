"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInAction, signUpAction, type AuthState } from "@/lib/auth/actions";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const action = isSignup ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null);

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
        </div>
        <form action={formAction} className="space-y-4">
          {isSignup && <Input name="full_name" placeholder="Full name" autoComplete="name" />}
          <Input
            name="email"
            placeholder="Email address"
            type="email"
            autoComplete="email"
            required
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={6}
          />
          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="text-sm text-teal" role="status">
              {state.message}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Please wait…" : isSignup ? "Create account" : "Login"}
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
