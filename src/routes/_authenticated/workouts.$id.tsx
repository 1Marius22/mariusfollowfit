import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Notice, cardCls } from "@/components/FormMessage";
import { workoutQuery } from "@/lib/workouts";
import { formatWorkoutDate } from "@/lib/workout-schema";

export const Route = createFileRoute("/_authenticated/workouts/$id")({
  head: () => ({
    meta: [
      { title: "Workout details — FollowFit" },
      { name: "description", content: "Details of a logged workout." },
      { property: "og:title", content: "Workout details — FollowFit" },
      { property: "og:description", content: "Details of a logged workout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkoutDetail,
});

function WorkoutDetail() {
  const { id } = Route.useParams();
  const { data, isPending, error } = useQuery(workoutQuery(id));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3">
        <Link to="/workouts"><ArrowLeft /> All workouts</Link>
      </Button>
      {isPending ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : error ? (
        <Notice kind="error">Couldn't load this workout: {error.message}</Notice>
      ) : !data ? (
        <div className={cardCls}>
          <h1 className="text-2xl font-bold">Workout not found</h1>
          <p className="mt-2 text-muted-foreground">It may have been removed, or it belongs to another account.</p>
        </div>
      ) : (
        <article className={cardCls}>
          <h1 className="text-3xl font-bold sm:text-4xl">{data.exercise_name}</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-secondary p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><CalendarDays className="size-3.5" /> Date</p>
              <p className="mt-1 font-display text-lg font-semibold">{formatWorkoutDate(data.workout_date)}</p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Clock className="size-3.5" /> Duration</p>
              <p className="mt-1 font-display text-lg font-semibold">{data.duration_minutes} minutes</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-foreground">{data.notes || <span className="text-muted-foreground">No notes for this session.</span>}</p>
          </div>
        </article>
      )}
    </div>
  );
}
