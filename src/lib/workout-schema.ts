import { z } from "zod";

export const workoutSchema = z.object({
  exercise_name: z.string().trim().min(1, "Exercise name is required").max(120, "Keep it under 120 characters"),
  workout_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date"),
  duration_minutes: z.coerce
    .number({ message: "Duration must be a number" })
    .int("Use whole minutes")
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration can't exceed 1440 minutes"),
  notes: z.string().trim().max(2000, "Notes must be under 2000 characters"),
});

export type WorkoutInput = z.infer<typeof workoutSchema>;

export const registerSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function formatWorkoutDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
