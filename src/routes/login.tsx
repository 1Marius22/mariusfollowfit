import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice, cardCls } from "@/components/FormMessage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Log in — FollowFit" },
      { name: "description", content: "Log in to FollowFit to see and track your workouts." },
      { property: "og:title", content: "Log in — FollowFit" },
      { property: "og:description", content: "Log in to FollowFit to see and track your workouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function safePath(p?: string) {
  if (!p) return "/workouts";
  try {
    const u = new URL(p, window.location.origin);
    return u.origin === window.location.origin ? u.pathname + u.search : "/workouts";
  } catch { return "/workouts"; }
}

function Login() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return setError("Enter your email and password.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return setError(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
    navigate({ to: safePath(redirect) });
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className={cardCls}>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to continue tracking.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {error && <Notice kind="error">{error}</Notice>}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Logging in…" : "Log in"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account? <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
