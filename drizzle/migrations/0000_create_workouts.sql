CREATE TABLE public.workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  exercise_name text NOT NULL CHECK (char_length(exercise_name) BETWEEN 1 AND 120),
  workout_date date NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX workouts_user_date_idx ON public.workouts (user_id, workout_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own workouts" ON public.workouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workouts" ON public.workouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own workouts" ON public.workouts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own workouts" ON public.workouts FOR DELETE TO authenticated USING (auth.uid() = user_id);