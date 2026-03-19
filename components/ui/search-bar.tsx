"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

import type { PokemonIndexEntry } from "@/lib/types";
import { formatPokemonId, normalizeSearchValue, titleize } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  entries: PokemonIndexEntry[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSelectEntry?: (entry: PokemonIndexEntry) => void;
  className?: string;
  compact?: boolean;
}

export function SearchBar({
  entries,
  placeholder = "Rechercher un Pokémon par nom ou numéro",
  value,
  onValueChange,
  onSelectEntry,
  className,
  compact = false
}: SearchBarProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const deferredQuery = useDeferredValue(value ?? internalValue);
  const query = value ?? internalValue;
  const suggestionSurfaceClass =
    "border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] text-[color:var(--text-secondary)]";

  useEffect(() => {
    if (typeof value === "string") {
      setInternalValue(value);
    }
  }, [value]);

  const normalizedQuery = normalizeSearchValue(deferredQuery);
  const getEntryLabel = (entry: PokemonIndexEntry) => entry.displayName ?? titleize(entry.name);
  const suggestions = normalizedQuery
    ? entries
        .map((entry) => {
          const numericQuery = Number(normalizedQuery);
          const searchTerms = [
            entry.name,
            titleize(entry.name),
            entry.displayName,
            ...(entry.searchAliases ?? [])
          ]
            .filter(Boolean)
            .map((term) => normalizeSearchValue(term as string));

          if (Number.isFinite(numericQuery) && entry.id === numericQuery) {
            return { entry, score: -1 };
          }

          if (searchTerms.some((term) => term === normalizedQuery)) {
            return { entry, score: 0 };
          }

          if (searchTerms.some((term) => term.startsWith(normalizedQuery))) {
            return { entry, score: 1 };
          }

          if (
            searchTerms.some((term) => term.includes(normalizedQuery)) ||
            formatPokemonId(entry.id).toLowerCase().includes(normalizedQuery)
          ) {
            return { entry, score: 2 };
          }

          return null;
        })
        .filter((result): result is { entry: PokemonIndexEntry; score: number } => result !== null)
        .sort((left, right) => {
          if (left.score !== right.score) {
            return left.score - right.score;
          }

          return left.entry.id - right.entry.id;
        })
        .map((result) => result.entry)
        .slice(0, 6)
    : entries.slice(0, 6);

  function updateValue(nextValue: string) {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  function handleSelect(entry: PokemonIndexEntry) {
    updateValue(getEntryLabel(entry));
    setIsOpen(false);

    if (onSelectEntry) {
      onSelectEntry(entry);
      return;
    }

    router.push(`/pokemon/${entry.slug}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!suggestions.length) {
      return;
    }

    handleSelect(suggestions[0]);
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className={cn("glass-panel flex items-center gap-3 px-4", compact ? "py-2.5" : "py-3")}>
        <div className={cn("theme-button-solid flex items-center justify-center rounded-2xl shadow-sm", compact ? "h-10 w-10" : "h-12 w-12")}>
          <Search className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
        </div>
        <input
          value={query}
          onChange={(event) => updateValue(event.target.value)}
          onFocus={(event) => {
            setIsOpen(true);
            event.currentTarget.select();
          }}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          placeholder={placeholder}
          className={cn(
            "theme-input flex-1 border-none text-sm outline-none placeholder:text-[color:var(--text-muted)]",
            compact ? "h-10" : "h-12"
          )}
          aria-label={placeholder}
        />
        <button
          type="submit"
          className={cn(
            "theme-button-solid hidden rounded-full text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex",
            compact ? "px-4 py-2" : "px-4 py-2.5"
          )}
        >
          Explorer
        </button>
      </form>

      {isOpen && suggestions.length ? (
        <div className="absolute inset-x-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-[28px] border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)] shadow-float backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-[color:var(--line-soft)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] theme-text-muted">
            <Sparkles className="h-4 w-4" />
            Suggestions rapides
          </div>
          <div className="p-2">
            {suggestions.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleSelect(entry)}
                className="flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left transition-colors duration-200 hover:bg-[color:var(--accent-soft)]"
              >
                <div>
                  <p className="text-sm font-semibold theme-text-strong">{getEntryLabel(entry)}</p>
                  <p className="text-xs theme-text-secondary">{formatPokemonId(entry.id)}</p>
                </div>
                <span className={cn("rounded-full px-2 py-1 text-xs font-medium", suggestionSurfaceClass)}>
                  Ouvrir
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
