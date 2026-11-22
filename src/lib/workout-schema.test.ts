import { describe, expect, it } from "vitest";
import { registerSchema, workoutSchema } from "./workout-schema";

const base = { exercise_name: "Squats", workout_date: "2026-11-22", duration_minutes: "45", notes: "" };

describe("workout rules", () => {
  it("requires an exercise name", () => {
    expect(workoutSchema.safeParse({ ...base, exercise_name: "  " }).success).toBe(false);
  });
  it("requires a positive whole-minute duration", () => {
    expect(workoutSchema.safeParse({ ...base, duration_minutes: "0" }).success).toBe(false);
    expect(workoutSchema.safeParse(base).success).toBe(true);
  });
  it("register requires matching passwords", () => {
    expect(registerSchema.safeParse({ email: "a@b.co", password: "secret1", confirmPassword: "secret2" }).success).toBe(false);
  });
});
