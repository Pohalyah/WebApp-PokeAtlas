"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/components/providers/favorites-provider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  pokemonId: number;
  className?: string;
  showLabel?: boolean;
}

export function FavoriteButton({ pokemonId, className, showLabel = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pokemonId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(pokemonId)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
        favorite
          ? "border-rose-300/70 bg-rose-500/12 text-rose-300 hover:border-rose-300"
          : "theme-button-soft hover:border-[color:var(--line-strong)] hover:text-[color:var(--text-strong)]",
        className
      )}
      aria-pressed={favorite}
      aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
      {showLabel ? <span>{favorite ? "Favori" : "Ajouter"}</span> : null}
    </button>
  );
}
