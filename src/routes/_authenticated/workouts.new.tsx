import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, Notice, PageShell, cardCls } from "@/components/FormMessage";
import { supabase } from "@/integrations/supabase/client";
import { workoutSchema } from "@/lib/workout-schema";

export const Route = createFileRoute("/_authenticated/workouts/new")({
  head: () => ({
    meta: [
      { title: "Add workout — FollowFit" },
      { name: "description", content: "Log a new workout session." },
      { property: "og:title", content: "Add workout — FollowFit" },
      { property: "og:description", content: "Log a new workout session." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewWorkout,
});

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const empty = () => ({ exercise_name: "", workout_date: today(), duration_minutes: "", notes: "" });

function NewWorkout() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSaved(null);
    const parsed = workoutSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] ??= i.message;
      return setErrors(fe);
    }
    setErrors({});
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setLoading(false); return setError("Your session expired. Please log in again."); }
    const { data, error } = await supabase
      .from("workouts")
      .insert({ ...parsed.data, notes: parsed.data.notes || null, user_id: u.user.id })
      .select("id, exercise_name")
      .single();
    setLoading(false);
    if (error) return setError(`Couldn't save workout: ${error.message}`);
    queryClient.invalidateQueries({ queryKey: ["workouts"] });
    setSaved({ id: data.id, name: data.exercise_name });
    setForm(empty());
  }

  const set = (k: keyof ReturnType<typeof empty>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <PageShell title="Add workout" subtitle="Log what you did today.">
      <form onSubmit={onSubmit} className={`${cardCls} space-y-5`} noValidate>
        {error && <Notice kind="error">{error}</Notice>}
        {saved && (
          <Notice kind="success">
            <strong>{saved.name}</strong> saved!{" "}
            <Link to="/workouts/$id" params={{ id: saved.id }} className="font-semibold underline">View it</Link> or{" "}
            <Link to="/workouts" className="font-semibold underline">see all workouts</Link>.
          </Notice>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="name">Exercise name</Label>
          <Input id="name" placeholder="e.g. Back squats" value={form.exercise_name} onChange={set("exercise_name")} />
          <FieldError msg={errors["exercise_name"]} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="date">Workout date</Label>
            <Input id="date" type="date" value={form.workout_date} onChange={set("workout_date")} />
            <FieldError msg={errors["workout_date"]} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" min={1} inputMode="numeric" placeholder="45" value={form.duration_minutes} onChange={set("duration_minutes")} />
            <FieldError msg={errors["duration_minutes"]} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={4} placeholder="Sets, reps, how it felt…" value={form.notes} onChange={set("notes")} />
          <FieldError msg={errors["notes"]} />
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>{loading ? "Saving…" : "Save workout"}</Button>
      </form>
    </PageShell>
  );
}
