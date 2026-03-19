export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface PokemonIndexEntry {
  id: number;
  name: string;
  slug: string;
  image: string;
  displayName?: string;
  searchAliases?: string[];
}

export interface PokemonCardSummary {
  id: number;
  name: string;
  displayName: string;
  slug: string;
  image: string;
  types: PokemonTypeName[];
  dominantType: PokemonTypeName;
}

export interface PokemonStat {
  key: string;
  label: string;
  value: number;
  effort: number;
}

export interface PokemonAbilitySummary {
  name: string;
  displayName: string;
  isHidden: boolean;
  description: string | null;
}

export interface PokemonResistanceItem {
  type: PokemonTypeName;
  multiplier: number;
}

export interface EvolutionNode {
  id: number;
  name: string;
  displayName: string;
  slug: string;
  image: string;
  trigger: string | null;
  children: EvolutionNode[];
}

export interface PokemonFormSummary {
  id: number;
  name: string;
  displayName: string;
  slug: string;
  image: string;
  types: PokemonTypeName[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  displayName: string;
  slug: string;
  description: string;
  genus: string | null;
  generation: string | null;
  image: string;
  shinyImage: string | null;
  sprite: string | null;
  types: PokemonTypeName[];
  dominantType: PokemonTypeName;
  height: string;
  weight: string;
  abilities: PokemonAbilitySummary[];
  stats: PokemonStat[];
  totalStats: number;
  weaknesses: PokemonResistanceItem[];
  resistances: PokemonResistanceItem[];
  immunities: PokemonTypeName[];
  evolutionPaths: EvolutionNode[][];
  forms: PokemonFormSummary[];
  similarPokemon: PokemonCardSummary[];
  previous: PokemonCardSummary | null;
  next: PokemonCardSummary | null;
  gender: string;
  genderDistribution: {
    male: number;
    female: number;
  } | null;
  effortValues: string[];
  captureRate: string | null;
  habitat: string | null;
  smogonUrl: string;
}
