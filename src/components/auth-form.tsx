"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthFormState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthAction = (
  state: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;

const copy = {
  "sign-in": {
    title: "Sign in",
    description: "Welcome back to Wikimasters.",
    submit: "Sign in",
    pending: "Signing in…",
    alt: "Don't have an account?",
    altLink: { href: "/auth/sign-up", label: "Sign up" },
  },
  "sign-up": {
    title: "Create an account",
    description: "Join Wikimasters to write and edit articles.",
    submit: "Create account",
    pending: "Creating account…",
    alt: "Already have an account?",
    altLink: { href: "/auth/sign-in", label: "Sign in" },
  },
} as const;

export function AuthForm({
  mode,
  action,
}: {
  mode: keyof typeof copy;
  action: AuthAction;
}) {
  const [state, formAction, isPending] = useActionState(action, null);
  const text = copy[mode];

  return (
    <Card className="mx-auto mt-16 w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {mode === "sign-up" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                placeholder="Ada Lovelace"
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "sign-up" ? "new-password" : "current-password"
              }
              required
              minLength={8}
            />
          </div>
          {state?.error && (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 mt-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? text.pending : text.submit}
          </Button>
          <p className="text-muted-foreground text-sm">
            {text.alt}{" "}
            <Link
              href={text.altLink.href}
              className="font-medium text-foreground hover:underline"
            >
              {text.altLink.label}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
