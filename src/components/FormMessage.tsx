import { CheckCircle2, AlertCircle } from "lucide-react";

export function Notice({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  const cls = kind === "error" ? "bg-destructive/10 text-destructive" : "bg-success text-success-foreground";
  const Icon = kind === "error" ? AlertCircle : CheckCircle2;
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${cls}`}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function FieldError({ msg }: { msg?: string | undefined }) {
  return msg ? <p className="text-xs font-medium text-destructive">{msg}</p> : null;
}

export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

export const cardCls = "rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8";
