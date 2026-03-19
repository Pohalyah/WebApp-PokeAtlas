import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-header-shell mt-10 border-t">
      <div className="page-shell flex flex-col gap-6 py-8 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="font-medium theme-text-strong">Atlas Pokedex</p>
          <p className="theme-text-secondary">
            Une encyclopedie Pokemon claire, rapide et moderne, construite autour de l essentiel.
          </p>
          <p className="theme-text-muted">
            Donnees Pokemon fournies via PokeAPI. Les informations legales ci-dessous restent a completer avant toute monétisation active.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3 sm:justify-end">
          <Link
            href="/mentions-legales"
            className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-4 py-2 theme-text-secondary transition-colors hover:text-[color:var(--text-strong)]"
          >
            Mentions legales
          </Link>
          <Link
            href="/confidentialite"
            className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-4 py-2 theme-text-secondary transition-colors hover:text-[color:var(--text-strong)]"
          >
            Confidentialite
          </Link>
          <Link
            href="/cookies"
            className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-4 py-2 theme-text-secondary transition-colors hover:text-[color:var(--text-strong)]"
          >
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
