import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animated-sheen animate-shimmer rounded-2xl bg-[linear-gradient(90deg,var(--skeleton-start),var(--skeleton-mid),var(--skeleton-end))]",
        className
      )}
    />
  );
}
