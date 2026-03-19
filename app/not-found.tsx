import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export default function NotFoundPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <EmptyState
        title="Cette fiche n&apos;existe pas"
        description="Le Pokemon demande est introuvable ou indisponible pour le moment. Repars vers le Pokedex pour continuer l'exploration."
        ctaHref="/pokedex"
        ctaLabel="Retour au Pokedex"
      />
      <div className="mt-5 text-center text-sm theme-text-secondary">
        <Link href="/" className="font-medium theme-text-primary transition-colors hover:text-[color:var(--text-strong)]">
          Revenir a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
