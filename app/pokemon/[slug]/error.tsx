"use client";

import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export default function PokemonErrorPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <EmptyState
        title="Impossible de charger cette fiche"
        description="Une erreur s&apos;est produite pendant la recuperation des donnees Pokemon. Tu peux reessayer ou repartir vers le Pokedex."
        ctaHref="/pokedex"
        ctaLabel="Ouvrir le Pokedex"
      />
      <div className="mt-5 text-center text-sm theme-text-secondary">
        <Link href="/" className="font-medium theme-text-primary transition-colors hover:text-[color:var(--text-strong)]">
          Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
