"use client";

import { useDeferredValue, useEffect, useState } from "react";

import { FilterBar } from "@/components/pokemon/filter-bar";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import { GENERATIONS, POKEDEX_PAGE_SIZE } from "@/lib/constants";
import type { PokemonCardSummary, PokemonIndexEntry, PokemonTypeName } from "@/lib/types";
import { normalizeSearchValue, titleize } from "@/lib/utils";

interface PokedexExplorerProps {
  index: PokemonIndexEntry[];
}

export function PokedexExplorer({ index }: PokedexExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<PokemonTypeName | "all">("all");
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [selectedSort, setSelectedSort] = useState("number-asc");
  const [page, setPage] = useState(1);
  const [typeIds, setTypeIds] = useState<number[] | null>(null);
  const [typeLoading, setTypeLoading] = useState(false);
  const [cards, setCards] = useState<PokemonCardSummary[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setPage(1);
  }, [deferredQuery, selectedType, selectedGeneration, selectedSort]);

  useEffect(() => {
    if (selectedType === "all") {
      setTypeIds(null);
      setTypeLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadTypeIds() {
      setTypeLoading(true);

      try {
        const response = await fetch(`/api/pokemon/type/${selectedType}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as { ids: number[] };
        setTypeIds(data.ids);
      } catch {
        if (!controller.signal.aborted) {
          setTypeIds([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setTypeLoading(false);
        }
      }
    }

    void loadTypeIds();

    return () => controller.abort();
  }, [selectedType]);

  const normalizedQuery = normalizeSearchValue(deferredQuery);
  const generation = GENERATIONS.find((entry) => entry.key === selectedGeneration) ?? GENERATIONS[0];
  const filteredEntries = index
    .filter((entry) => {
      const searchTerms = [
        entry.name,
        titleize(entry.name),
        entry.displayName,
        ...(entry.searchAliases ?? [])
      ]
        .filter(Boolean)
        .map((term) => normalizeSearchValue(term as string));
      const queryMatch =
        !normalizedQuery ||
        searchTerms.some((term) => term.includes(normalizedQuery)) ||
        entry.id.toString() === normalizedQuery ||
        entry.id.toString().includes(normalizedQuery);
      const generationMatch =
        selectedGeneration === "all" || (entry.id >= generation.from && entry.id <= generation.to);
      const typeMatch = !typeIds || typeIds.includes(entry.id);

      return queryMatch && generationMatch && typeMatch;
    })
    .slice()
    .sort((left, right) => {
      if (selectedSort === "number-desc") {
        return right.id - left.id;
      }

      if (selectedSort === "name-asc") {
        return (left.displayName ?? left.name).localeCompare(right.displayName ?? right.name, "fr");
      }

      return left.id - right.id;
    });

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / POKEDEX_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleIds = filteredEntries
    .slice((currentPage - 1) * POKEDEX_PAGE_SIZE, currentPage * POKEDEX_PAGE_SIZE)
    .map((entry) => entry.id);
  const visibleIdsQuery = visibleIds.join(",");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCards() {
      if (!visibleIdsQuery) {
        setCards([]);
        setCardsLoading(false);
        return;
      }

      setCardsLoading(true);

      try {
        const response = await fetch(`/api/pokemon/cards?ids=${visibleIdsQuery}`, {
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
          setCardsLoading(false);
        }
      }
    }

    void loadCards();

    return () => controller.abort();
  }, [visibleIdsQuery]);

  return (
    <div className="space-y-5">
      <SearchBar
        entries={index}
        value={query}
        onValueChange={setQuery}
        onSelectEntry={(entry) => setQuery(entry.displayName ?? titleize(entry.name))}
        placeholder="Filtrer par nom ou numero"
      />

      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedGeneration={selectedGeneration}
        onGenerationChange={setSelectedGeneration}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        typeLoading={typeLoading}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-text-muted">Resultats</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight theme-text-strong">Pokedex moderne</h1>
        </div>
        <p className="text-sm theme-text-secondary">
          {filteredEntries.length} Pokemon trouves · page {currentPage}/{totalPages}
        </p>
      </div>

      {!cardsLoading && !filteredEntries.length ? (
        <EmptyState
          title="Aucun Pokemon trouve"
          description="Essaie un autre nom, retire un filtre ou reviens a une generation plus large."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cardsLoading
            ? Array.from({ length: POKEDEX_PAGE_SIZE }).map((_, indexValue) => <PokemonCardSkeleton key={indexValue} />)
            : cards.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)}
        </div>
      )}

      {filteredEntries.length ? (
        <div className="glass-panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setPage((currentValue) => Math.max(1, currentValue - 1))}
            disabled={currentPage === 1}
            className="theme-button-soft rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Page precedente
          </button>
          <div className="text-sm theme-text-secondary">
            Affichage {(currentPage - 1) * POKEDEX_PAGE_SIZE + 1}
            {" - "}
            {Math.min(currentPage * POKEDEX_PAGE_SIZE, filteredEntries.length)} sur {filteredEntries.length}
          </div>
          <button
            type="button"
            onClick={() => setPage((currentValue) => Math.min(totalPages, currentValue + 1))}
            disabled={currentPage === totalPages}
            className="theme-button-soft rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Page suivante
          </button>
        </div>
      ) : null}
    </div>
  );
}
