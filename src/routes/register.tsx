import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, Notice, cardCls } from "@/components/FormMessage";
import { supabase } from "@/integrations/supabase/client";
import { registerSchema } from "@/lib/workout-schema";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — FollowFit" },
      { name: "description", content: "Create a free FollowFit account and start tracking your workouts." },
      { property: "og:title", content: "Create account — FollowFit" },
      { property: "og:description", content: "Create a free FollowFit account and start tracking your workouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});

function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] ??= i.message;
      return setErrors(fe);
    }
    setErrors({});
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: `${window.location.origin}/workouts` },
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.user && data.user.identities?.length === 0) return setError("An account with this email already exists.");
    setSuccess(data.session ? "Account created! You're signed in." : "Account created! Check your email to confirm your address, then log in.");
    setForm({ email: "", password: "", confirmPassword: "" });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className={cardCls}>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start tracking your workouts today.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {error && <Notice kind="error">{error}</Notice>}
          {success && <Notice kind="success">{success}</Notice>}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
            <FieldError msg={errors["email"]} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
            <FieldError msg={errors["password"]} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} />
            <FieldError msg={errors["confirmPassword"]} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Creating account…" : "Register"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" search={{ redirect: undefined }} className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
