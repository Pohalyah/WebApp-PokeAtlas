"use client";

import { useEffect, useState } from "react";

import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-skeletons";
import { useFavorites } from "@/components/providers/favorites-provider";
import { EmptyState } from "@/components/ui/empty-state";
import type { PokemonCardSummary } from "@/lib/types";

export function FavoritesGrid() {
  const { favorites } = useFavorites();
  const [cards, setCards] = useState<PokemonCardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const favoriteIdsQuery = favorites.join(",");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCards() {
      if (!favoriteIdsQuery) {
        setCards([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`/api/pokemon/cards?ids=${favoriteIdsQuery}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as { cards: PokemonCardSummary[] };

        if (!controller.signal.aborted) {
          setCards(data.cards);
        }
      } catch {
        if (!controller.signal.aborted) {
          setCards([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCards();

    return () => controller.abort();
  }, [favoriteIdsQuery]);

  if (!loading && !favorites.length) {
    return (
      <EmptyState
        title="Aucun favori pour l’instant"
        description="Ajoute des Pokémon depuis le Pokédex ou une fiche détail pour retrouver rapidement ton équipe idéale."
        ctaHref="/pokedex"
        ctaLabel="Explorer le Pokédex"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => <PokemonCardSkeleton key={index} />)
        : cards.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)}
    </div>
  );
}
