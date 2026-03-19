import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  eyebrow,
  description,
  action,
  children,
  className,
  contentClassName
}: SectionCardProps) {
  return (
    <section className={cn("glass-panel overflow-hidden", className)}>
      {(title || eyebrow || description || action) && (
        <header className="flex flex-col gap-4 border-b border-[color:var(--line-soft)] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-text-muted">{eyebrow}</p>
            ) : null}
            {title ? <h2 className="font-display text-xl font-semibold tracking-tight theme-text-strong">{title}</h2> : null}
            {description ? <p className="max-w-2xl text-sm leading-6 theme-text-secondary">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      <div className={cn("px-6 py-6", contentClassName)}>{children}</div>
    </section>
  );
}
