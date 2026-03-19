import { cn } from "@/lib/utils";

interface InfoPanelProps {
  label: string;
  value: string;
  hint?: string | null;
  className?: string;
}

export function InfoPanel({ label, value, hint, className }: InfoPanelProps) {
  return (
    <div className={cn("rounded-[22px] border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] p-4 shadow-sm", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] theme-text-muted">{label}</p>
      <p className="mt-2 text-base font-semibold tracking-tight theme-text-strong">{value}</p>
      {hint ? <p className="mt-1 text-sm theme-text-secondary">{hint}</p> : null}
    </div>
  );
}
