import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Clock, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FollowFit — Track every workout" },
      { name: "description", content: "FollowFit helps you log exercises, durations and notes so you can see your training progress." },
      { property: "og:title", content: "FollowFit — Track every workout" },
      { property: "og:description", content: "Log exercises, durations and notes. See your training progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: NotebookPen, title: "Log in seconds", text: "Exercise, date, duration and notes — that's it." },
  { icon: CalendarCheck, title: "See your history", text: "Every session in one clean timeline." },
  { icon: Clock, title: "Track your time", text: "Know exactly how many minutes you put in." },
];

function Index() {
  return (
    <>
      <section className="bg-hero text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <span className="inline-block rounded-full border border-ink-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-glow">
            Your training log
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] sm:text-7xl">
            Show up. Log it. <span className="text-primary-glow">Get stronger.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-foreground/75">
            FollowFit is the simple way to track your workouts — every exercise, every minute, every note, saved to your account.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/workouts">Start Tracking <ArrowRight /></Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/workouts/new">Add a workout</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground"><f.icon className="size-5" /></span>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
