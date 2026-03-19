"use client";

import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export default function GlobalErrorPage() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <EmptyState
        title="Une erreur est survenue"
        description="Le contenu demande n'a pas pu etre affiche correctement. Reviens a l'accueil ou relance ton exploration depuis le Pokedex."
        ctaHref="/"
        ctaLabel="Retour a l'accueil"
      />
      <div className="mt-5 text-center text-sm theme-text-secondary">
        <Link href="/pokedex" className="font-medium theme-text-primary transition-colors hover:text-[color:var(--text-strong)]">
          Aller au Pokedex
        </Link>
      </div>
    </div>
  );
}
