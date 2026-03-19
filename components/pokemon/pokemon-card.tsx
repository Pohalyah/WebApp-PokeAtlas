import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/components/ui/favorite-button";
import { TypeBadge } from "@/components/ui/type-badge";
import { getTypeTheme } from "@/lib/pokemon-theme";
import type { PokemonCardSummary } from "@/lib/types";
import { formatPokemonId } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: PokemonCardSummary;
  priority?: boolean;
}

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const theme = getTypeTheme(pokemon.dominantType);

  return (
    <article className="group relative">
      <div className="absolute right-4 top-4 z-10">
        <FavoriteButton pokemonId={pokemon.id} />
      </div>

      <Link
        href={`/pokemon/${pokemon.slug}`}
        className="glass-panel relative block h-full overflow-hidden rounded-[30px] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float"
      >
        <div
          className="absolute inset-x-5 top-5 h-36 rounded-[26px] opacity-90 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${theme.bg} 0%, rgba(255,255,255,0) 70%)`
          }}
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-text-muted">{formatPokemonId(pokemon.id)}</p>
          </div>

          <div className="relative mt-2 flex min-h-[190px] items-center justify-center">
            <Image
              src={pokemon.image}
              alt={pokemon.displayName}
              width={240}
              height={240}
              priority={priority}
              className="h-40 w-40 object-contain drop-shadow-[0_20px_32px_rgba(15,23,42,0.18)] transition-transform duration-300 group-hover:scale-105 sm:h-44 sm:w-44"
            />
          </div>

          <div className="mt-auto space-y-3">
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight theme-text-strong">{pokemon.displayName}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
