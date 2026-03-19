import Link from "next/link";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyState({ title, description, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="theme-surface-soft flex h-16 w-16 items-center justify-center rounded-3xl border theme-text-secondary">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight theme-text-strong">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 theme-text-secondary">{description}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="theme-button-solid mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
