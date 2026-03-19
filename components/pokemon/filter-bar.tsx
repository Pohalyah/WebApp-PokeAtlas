"use client";

import { Loader2, SlidersHorizontal } from "lucide-react";

import { GENERATIONS, POKEMON_TYPES, SORT_OPTIONS } from "@/lib/constants";
import { getTypeLabel } from "@/lib/pokemon-theme";
import type { PokemonTypeName } from "@/lib/types";

interface FilterBarProps {
  selectedType: PokemonTypeName | "all";
  onTypeChange: (value: PokemonTypeName | "all") => void;
  selectedGeneration: string;
  onGenerationChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  typeLoading?: boolean;
}

export function FilterBar({
  selectedType,
  onTypeChange,
  selectedGeneration,
  onGenerationChange,
  selectedSort,
  onSortChange,
  typeLoading = false
}: FilterBarProps) {
  return (
    <div className="glass-panel flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 theme-text-secondary">
        <div className="theme-button-solid flex h-11 w-11 items-center justify-center rounded-2xl">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold theme-text-strong">Filtres utiles uniquement</p>
          <p className="text-sm theme-text-secondary">Type, generation et tri pour parcourir vite.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2 text-sm theme-text-secondary">
          <span className="font-medium theme-text-secondary">Type</span>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(event) => onTypeChange(event.target.value as PokemonTypeName | "all")}
              className="h-12 w-full rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-4 text-sm theme-text-primary outline-none transition-colors focus:border-[color:var(--line-strong)]"
            >
              <option value="all">Tous les types</option>
              {POKEMON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
            {typeLoading ? <Loader2 className="absolute right-4 top-4 h-4 w-4 animate-spin theme-text-muted" /> : null}
          </div>
        </label>

        <label className="space-y-2 text-sm theme-text-secondary">
          <span className="font-medium theme-text-secondary">Generation</span>
          <select
            value={selectedGeneration}
            onChange={(event) => onGenerationChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-4 text-sm theme-text-primary outline-none transition-colors focus:border-[color:var(--line-strong)]"
          >
            {GENERATIONS.map((generation) => (
              <option key={generation.key} value={generation.key}>
                {generation.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm theme-text-secondary">
          <span className="font-medium theme-text-secondary">Tri</span>
          <select
            value={selectedSort}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] px-4 text-sm theme-text-primary outline-none transition-colors focus:border-[color:var(--line-strong)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
