import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  accent: string;
  max?: number;
  className?: string;
}

export function StatBar({ label, value, accent, max = 255, className }: StatBarProps) {
  const width = `${Math.min((value / max) * 100, 100)}%`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium theme-text-secondary">{label}</span>
        <span className="text-sm font-semibold theme-text-strong">{value}</span>
      </div>
      <div className="theme-track h-2.5 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width,
            background: `linear-gradient(90deg, ${accent} 0%, var(--surface-elevated) 150%)`
          }}
        />
      </div>
    </div>
  );
}
