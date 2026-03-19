import type { PokemonTypeName } from "@/lib/types";

export const TOTAL_POKEMON = 1025;
export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
export const POKEDEX_PAGE_SIZE = 24;

export const GENERATIONS = [
  { key: "all", label: "Toutes les générations", region: "National", from: 1, to: TOTAL_POKEMON },
  { key: "gen-1", label: "Génération I", region: "Kanto", from: 1, to: 151 },
  { key: "gen-2", label: "Génération II", region: "Johto", from: 152, to: 251 },
  { key: "gen-3", label: "Génération III", region: "Hoenn", from: 252, to: 386 },
  { key: "gen-4", label: "Génération IV", region: "Sinnoh", from: 387, to: 493 },
  { key: "gen-5", label: "Génération V", region: "Unys", from: 494, to: 649 },
  { key: "gen-6", label: "Génération VI", region: "Kalos", from: 650, to: 721 },
  { key: "gen-7", label: "Génération VII", region: "Alola", from: 722, to: 809 },
  { key: "gen-8", label: "Génération VIII", region: "Galar", from: 810, to: 905 },
  { key: "gen-9", label: "Génération IX", region: "Paldea", from: 906, to: TOTAL_POKEMON }
] as const;

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy"
] as const satisfies readonly PokemonTypeName[];

export const SORT_OPTIONS = [
  { value: "number-asc", label: "Numéro croissant" },
  { value: "number-desc", label: "Numéro décroissant" },
  { value: "name-asc", label: "Nom A-Z" }
] as const;
