"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { SearchBar } from "@/components/ui/search-bar";
import { TypeBadge } from "@/components/ui/type-badge";
import { getTypeTheme } from "@/lib/pokemon-theme";
import type { PokemonCardSummary, PokemonIndexEntry } from "@/lib/types";
import { clamp, formatPokemonId } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PokemonCarouselProps {
  items: PokemonCardSummary[];
  selectedPokemonId: number;
  searchEntries: PokemonIndexEntry[];
}

export function PokemonCarousel({ items, selectedPokemonId, searchEntries }: PokemonCarouselProps) {
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(() =>
    Math.max(
      0,
      items.findIndex((item) => item.id === selectedPokemonId)
    )
  );
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const selectedIndex = items.findIndex((item) => item.id === selectedPokemonId);
    setCarouselIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [items, selectedPokemonId]);

  useEffect(() => {
    itemRefs.current[carouselIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }, [carouselIndex]);

  function move(delta: number) {
    setCarouselIndex((currentValue) => clamp(currentValue + delta, 0, items.length - 1));
  }

  return (
    <div className="space-y-5">
      <SearchBar entries={searchEntries} />

      <section className="glass-panel overflow-hidden px-4 py-5 sm:px-5 sm:py-6">
        <div className="mb-4 flex items-center justify-between gap-4 px-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Navigation fluide</p>
            <h2 className="font-display text-xl font-semibold tracking-tight text-slate-950">Carrousel de voisinage</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-slate-300 hover:text-slate-950"
              aria-label="Faire défiler vers la gauche"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-slate-300 hover:text-slate-950"
              aria-label="Faire défiler vers la droite"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-stretch gap-3 px-2">
            {items.map((item, index) => {
              const isSelected = item.id === selectedPokemonId;
              const isFocused = index === carouselIndex;
              const theme = getTypeTheme(item.dominantType);

              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  type="button"
                  onFocus={() => setCarouselIndex(index)}
                  onMouseEnter={() => setCarouselIndex(index)}
                  onClick={() => router.push(`/pokemon/${item.slug}`)}
                  className={cn(
                    "group relative flex min-w-[148px] flex-col items-center rounded-[28px] border px-4 py-4 text-center transition-all duration-300",
                    isSelected
                      ? "scale-[1.02] border-slate-950 bg-slate-950 text-white shadow-float"
                      : isFocused
                        ? "border-slate-300 bg-white shadow-card"
                        : "border-slate-200/90 bg-white/[0.84] hover:border-slate-300 hover:bg-white",
                    isSelected && "min-w-[172px]"
                  )}
                  style={{
                    boxShadow: isFocused && !isSelected ? `0 20px 50px -28px ${theme.ring}` : undefined
                  }}
                  aria-current={isSelected ? "page" : undefined}
                >
                  <span className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", isSelected ? "text-white/60" : "text-slate-400")}>
                    {formatPokemonId(item.id)}
                  </span>
                  <div className="relative mt-3 flex h-24 w-24 items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background: `radial-gradient(circle at center, ${theme.bg} 0%, rgba(255,255,255,0) 70%)`
                      }}
                    />
                    <Image
                      src={item.image}
                      alt={item.displayName}
                      width={112}
                      height={112}
                      className={cn(
                        "relative object-contain transition-transform duration-300",
                        isSelected ? "h-24 w-24 scale-110" : "h-20 w-20 group-hover:scale-105"
                      )}
                    />
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold tracking-tight">{item.displayName}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {item.types.map((type) => (
                      <TypeBadge
                        key={type}
                        type={type}
                        inverted={isSelected}
                        className="px-2.5 py-1 text-[11px]"
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
