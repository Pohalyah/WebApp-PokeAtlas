import Link from "next/link";
import { ArrowLeft, ArrowRight, Ruler, Scaling, Sparkles } from "lucide-react";

import { FavoriteButton } from "@/components/ui/favorite-button";
import { TypeBadge } from "@/components/ui/type-badge";
import { getTypeTheme } from "@/lib/pokemon-theme";
import type { PokemonDetail } from "@/lib/types";
import { formatPokemonId } from "@/lib/utils";

interface HeroHeaderProps {
  pokemon: PokemonDetail;
}

export function HeroHeader({ pokemon }: HeroHeaderProps) {
  const theme = getTypeTheme(pokemon.dominantType);

  return (
    <section className="glass-panel overflow-hidden">
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} px-6 py-7 sm:px-8 sm:py-8`}>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-60"
          style={{
            background: `radial-gradient(circle at center, ${theme.bg} 0%, rgba(255,255,255,0) 65%)`
          }}
        />

        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                {formatPokemonId(pokemon.id)}
              </span>
              {pokemon.generation ? (
                <span className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">
                  {pokemon.generation}
                </span>
              ) : null}
              {pokemon.genus ? (
                <span className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">
                  {pokemon.genus}
                </span>
              ) : null}
            </div>

            <h1 className="balanced-text mt-5 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              {pokemon.displayName}
            </h1>
            <p className="balanced-text mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{pokemon.description}</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} className="px-4 py-2 text-sm" />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-[22px] border border-white/75 bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Ruler className="h-4 w-4" />
                  Taille
                </div>
                <p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{pokemon.height}</p>
              </div>
              <div className="rounded-[22px] border border-white/75 bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Scaling className="h-4 w-4" />
                  Poids
                </div>
                <p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{pokemon.weight}</p>
              </div>
              <div className="rounded-[22px] border border-white/75 bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Sparkles className="h-4 w-4" />
                  Total stats
                </div>
                <p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{pokemon.totalStats}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col xl:items-stretch">
            <FavoriteButton pokemonId={pokemon.id} showLabel className="justify-center border-white/80 bg-white/90" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {pokemon.previous ? (
                <Link
                  href={`/pokemon/${pokemon.previous.slug}`}
                  className="inline-flex items-center justify-between rounded-[22px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 transition-transform duration-200 hover:-translate-y-0.5 hover:text-slate-950"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </span>
                  <span className="font-semibold">{pokemon.previous.displayName}</span>
                </Link>
              ) : null}
              {pokemon.next ? (
                <Link
                  href={`/pokemon/${pokemon.next.slug}`}
                  className="inline-flex items-center justify-between rounded-[22px] border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 transition-transform duration-200 hover:-translate-y-0.5 hover:text-slate-950"
                >
                  <span className="font-semibold">{pokemon.next.displayName}</span>
                  <span className="flex items-center gap-2">
                    Suivant
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
