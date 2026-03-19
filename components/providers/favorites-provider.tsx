"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "atlas-pokedex:favorites";

interface FavoritesContextValue {
  favorites: number[];
  isFavorite: (pokemonId: number) => boolean;
  toggleFavorite: (pokemonId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return;
    }

    try {
      const parsed = JSON.parse(storedValue) as number[];
      setFavorites(Array.isArray(parsed) ? parsed.filter(Number.isFinite) : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  function toggleFavorite(pokemonId: number) {
    setFavorites((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(pokemonId)
        ? currentFavorites.filter((favoriteId) => favoriteId !== pokemonId)
        : [...currentFavorites, pokemonId].sort((left, right) => left - right);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  }

  function isFavorite(pokemonId: number) {
    return favorites.includes(pokemonId);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
