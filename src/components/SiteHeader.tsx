import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const navLink = "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
const navActive = { className: "bg-secondary text-secondary-foreground" };

export function SiteHeader() {
  const { session, ready } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/login", replace: true });
  }

  const links = (
    <>
      <Link to="/" className={navLink} activeProps={navActive} activeOptions={{ exact: true }} onClick={() => setOpen(false)}>Home</Link>
      <Link to="/workouts" className={navLink} activeProps={navActive} activeOptions={{ exact: true }} onClick={() => setOpen(false)}>Workouts</Link>
      <Link to="/workouts/new" className={navLink} activeProps={navActive} onClick={() => setOpen(false)}>Add Workout</Link>
    </>
  );
  const auth = !ready ? null : session ? (
    <Button variant="outline" size="sm" onClick={signOut}>Logout</Button>
  ) : (
    <>
      <Button variant="ghost" size="sm" asChild><Link to="/login" onClick={() => setOpen(false)}>Login</Link></Button>
      <Button size="sm" asChild><Link to="/register" onClick={() => setOpen(false)}>Register</Link></Button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Dumbbell className="size-5" /></span>
          FollowFit
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{links}</nav>
        <div className="hidden items-center gap-2 md:flex">{auth}</div>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 border-t border-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">{links}</nav>
          <div className="flex gap-2">{auth}</div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <span className="font-display font-semibold text-foreground">FollowFit</span>
        <span>© {new Date().getFullYear()} FollowFit · Track every rep.</span>
      </div>
    </footer>
  );
}
