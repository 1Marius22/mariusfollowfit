import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronRight, Clock, Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Notice, PageShell } from "@/components/FormMessage";
import { workoutsQuery } from "@/lib/workouts";
import { formatWorkoutDate } from "@/lib/workout-schema";

export const Route = createFileRoute("/_authenticated/workouts/")({
  head: () => ({
    meta: [
      { title: "My workouts — FollowFit" },
      { name: "description", content: "All your logged workouts in one place." },
      { property: "og:title", content: "My workouts — FollowFit" },
      { property: "og:description", content: "All your logged workouts in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workouts,
});

function Workouts() {
  const { data, isPending, error, refetch } = useQuery(workoutsQuery());
  const total = data?.reduce((s, w) => s + w.duration_minutes, 0) ?? 0;

  return (
    <PageShell title="My workouts" subtitle={data?.length ? `${data.length} sessions · ${total} minutes total` : "Your training history."}>
      <div className="mb-6 flex justify-end">
        <Button asChild><Link to="/workouts/new"><Plus /> Add Workout</Link></Button>
      </div>
      {isPending ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : error ? (
        <div className="space-y-3">
          <Notice kind="error">Couldn't load your workouts: {error.message}</Notice>
          <Button variant="outline" onClick={() => refetch()}>Try again</Button>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground"><Dumbbell /></span>
          <h2 className="mt-4 text-xl font-semibold">No workouts yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Log your first session to start your streak.</p>
          <Button className="mt-6" asChild><Link to="/workouts/new">Add your first workout</Link></Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((w) => (
            <li key={w.id}>
              <Link to="/workouts/$id" params={{ id: w.id }} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 sm:p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Dumbbell className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-semibold">{w.exercise_name}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{formatWorkoutDate(w.workout_date)}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" />{w.duration_minutes} min</span>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
