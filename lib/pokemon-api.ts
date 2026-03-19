import { GENERATIONS, POKEAPI_BASE_URL, TOTAL_POKEMON } from "@/lib/constants";
import { getTypeMatchups } from "@/lib/pokemon-type-chart";
import { getTypeLabel } from "@/lib/pokemon-theme";
import type {
  EvolutionNode,
  PokemonAbilitySummary,
  PokemonCardSummary,
  PokemonDetail,
  PokemonFormSummary,
  PokemonIndexEntry,
  PokemonStat,
  PokemonTypeName
} from "@/lib/types";
import {
  cleanFlavorText,
  extractIdFromUrl,
  formatKilogramsFromHectograms,
  formatMetersFromDecimeters,
  titleize
} from "@/lib/utils";

type NamedAPIResource = {
  name: string;
  url: string;
};

type PokemonResponse = {
  id: number;
  name: string;
  species: NamedAPIResource;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: NamedAPIResource;
  }>;
  types: Array<{
    slot: number;
    type: NamedAPIResource;
  }>;
  abilities: Array<{
    is_hidden: boolean;
    ability: NamedAPIResource;
  }>;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      home?: {
        front_default: string | null;
        front_shiny: string | null;
      };
      "official-artwork"?: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
};

type PokemonSpeciesResponse = {
  id: number;
  name: string;
  gender_rate: number;
  capture_rate: number;
  habitat: NamedAPIResource | null;
  generation: NamedAPIResource | null;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedAPIResource;
  }>;
  genera: Array<{
    genus: string;
    language: NamedAPIResource;
  }>;
  names: Array<{
    name: string;
    language: NamedAPIResource;
  }>;
  evolution_chain: {
    url: string;
  };
  varieties: Array<{
    is_default: boolean;
    pokemon: NamedAPIResource;
  }>;
};

type AbilityResponse = {
  names: Array<{ name: string; language: NamedAPIResource }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedAPIResource;
  }>;
};

type EvolutionChainResponse = {
  chain: EvolutionChainNodeResponse;
};

type EvolutionChainNodeResponse = {
  species: NamedAPIResource;
  evolves_to: EvolutionChainNodeResponse[];
  evolution_details: Array<{
    trigger: NamedAPIResource;
    min_level: number | null;
    item: NamedAPIResource | null;
    min_happiness: number | null;
    time_of_day: string;
  }>;
};

const REVALIDATE = 60 * 60 * 24;
const POKEMON_SPECIES_NAMES_CSV_URL =
  "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv";
const FRENCH_LANGUAGE_ID = 5;

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: {
      revalidate: REVALIDATE
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return response.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    next: {
      revalidate: REVALIDATE
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return response.text();
}

function parseCsvRow(line: string) {
  const cells: string[] = [];
  let current = "";
  let isQuoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (isQuoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        isQuoted = !isQuoted;
      }

      continue;
    }

    if (character === "," && !isQuoted) {
      cells.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  cells.push(current);
  return cells;
}

async function getFrenchPokemonNameMap() {
  const csv = await fetchText(POKEMON_SPECIES_NAMES_CSV_URL);
  const rows = csv.split(/\r?\n/).slice(1);
  const map = new Map<number, string>();

  rows.forEach((row) => {
    if (!row.trim()) {
      return;
    }

    const [speciesId, languageId, name] = parseCsvRow(row);

    if (Number(languageId) !== FRENCH_LANGUAGE_ID) {
      return;
    }

    const id = Number(speciesId);

    if (Number.isFinite(id) && name) {
      map.set(id, name);
    }
  });

  return map;
}

function getArtworkFromPokemon(pokemon: PokemonResponse) {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.other?.home?.front_default ??
    pokemon.sprites.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  );
}

function getShinyArtworkFromPokemon(pokemon: PokemonResponse) {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_shiny ??
    pokemon.sprites.other?.home?.front_shiny ??
    null
  );
}

function getPokemonDisplayName(
  name: string,
  localizedNames?: PokemonSpeciesResponse["names"]
) {
  const frenchName = localizedNames?.find((entry) => entry.language.name === "fr")?.name;
  return frenchName ?? titleize(name);
}

function getDescription(species: PokemonSpeciesResponse) {
  const frenchEntry = species.flavor_text_entries.find((entry) => entry.language.name === "fr");
  const englishEntry = species.flavor_text_entries.find((entry) => entry.language.name === "en");
  return cleanFlavorText(frenchEntry?.flavor_text ?? englishEntry?.flavor_text ?? "Aucune description disponible.");
}

function getGenus(species: PokemonSpeciesResponse) {
  const frenchGenus = species.genera.find((entry) => entry.language.name === "fr")?.genus;
  const englishGenus = species.genera.find((entry) => entry.language.name === "en")?.genus;
  return frenchGenus ?? englishGenus ?? null;
}

function getGeneration(species: PokemonSpeciesResponse) {
  const generationId = extractIdFromUrl(species.generation?.url ?? "");
  const generation = GENERATIONS.find((entry) => entry.key !== "all" && generationId === Number(entry.key.split("-")[1]));
  return generation ? `${generation.label} · ${generation.region}` : species.generation?.name ?? null;
}

function getGenderText(rate: number) {
  if (rate === -1) {
    return "Asexué";
  }

  const femaleRatio = (rate / 8) * 100;
  const maleRatio = 100 - femaleRatio;
  return `${Math.round(maleRatio)}% mâle · ${Math.round(femaleRatio)}% femelle`;
}

function getCaptureRateText(rate: number) {
  if (!Number.isFinite(rate)) {
    return null;
  }

  if (rate >= 200) {
    return "Très facile";
  }

  if (rate >= 120) {
    return "Facile";
  }

  if (rate >= 45) {
    return "Moyenne";
  }

  return "Difficile";
}

function getEffortValues(stats: PokemonStat[]) {
  return stats
    .filter((stat) => stat.effort > 0)
    .map((stat) => `${stat.effort} EV ${stat.label.toLowerCase()}`);
}

function mapStatLabel(key: string) {
  switch (key) {
    case "hp":
      return "PV";
    case "attack":
      return "Attaque";
    case "defense":
      return "Défense";
    case "special-attack":
      return "Att. Spé.";
    case "special-defense":
      return "Déf. Spé.";
    case "speed":
      return "Vitesse";
    default:
      return titleize(key);
  }
}

function mapPokemonStats(pokemon: PokemonResponse): PokemonStat[] {
  return pokemon.stats.map((stat) => ({
    key: stat.stat.name,
    label: mapStatLabel(stat.stat.name),
    value: stat.base_stat,
    effort: stat.effort
  }));
}

function mapSummaryFromPokemon(
  pokemon: Pick<PokemonResponse, "id" | "name" | "types" | "sprites">,
  displayName?: string
): PokemonCardSummary {
  const types = pokemon.types
    .slice()
    .sort((left, right) => left.slot - right.slot)
    .map((entry) => entry.type.name as PokemonTypeName);

  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName: displayName ?? titleize(pokemon.name),
    slug: pokemon.name,
    image:
      pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.other?.home?.front_default ??
      pokemon.sprites.front_default ??
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    types,
    dominantType: types[0]
  };
}

async function getAbilityDetails(abilities: PokemonResponse["abilities"]) {
  return Promise.all(
    abilities.map(async (ability): Promise<PokemonAbilitySummary> => {
      const details = await fetchJSON<AbilityResponse>(ability.ability.url);
      const frenchName = details.names.find((entry) => entry.language.name === "fr")?.name;
      const englishName = details.names.find((entry) => entry.language.name === "en")?.name;
      const frenchDescription = details.flavor_text_entries.find((entry) => entry.language.name === "fr")?.flavor_text;
      const englishDescription = details.flavor_text_entries.find((entry) => entry.language.name === "en")?.flavor_text;

      return {
        name: ability.ability.name,
        displayName: frenchName ?? englishName ?? titleize(ability.ability.name),
        isHidden: ability.is_hidden,
        description: cleanFlavorText(frenchDescription ?? englishDescription ?? "")
      };
    })
  );
}

function getEvolutionTrigger(node: EvolutionChainNodeResponse) {
  const detail = node.evolution_details[0];

  if (!detail) {
    return null;
  }

  if (detail.min_level) {
    return `Niveau ${detail.min_level}`;
  }

  if (detail.item) {
    return `Objet ${titleize(detail.item.name)}`;
  }

  if (detail.min_happiness) {
    return "Bonheur";
  }

  if (detail.time_of_day) {
    return `Moment ${detail.time_of_day}`;
  }

  return titleize(detail.trigger.name);
}

function mapEvolutionNode(node: EvolutionChainNodeResponse): EvolutionNode {
  const id = extractIdFromUrl(node.species.url);

  return {
    id,
    name: node.species.name,
    displayName: titleize(node.species.name),
    slug: node.species.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    trigger: getEvolutionTrigger(node),
    children: node.evolves_to.map(mapEvolutionNode)
  };
}

function buildEvolutionPaths(root: EvolutionNode): EvolutionNode[][] {
  if (!root.children.length) {
    return [[root]];
  }

  return root.children.flatMap((child) =>
    buildEvolutionPaths(child).map((path) => [root, ...path])
  );
}

function getHabitat(species: PokemonSpeciesResponse) {
  if (!species.habitat) {
    return null;
  }

  return titleize(species.habitat.name);
}

function getLocalizedTypeLabel(type: PokemonTypeName) {
  return getTypeLabel(type);
}

export async function getPokemonIndex(): Promise<PokemonIndexEntry[]> {
  const [response, frenchNameMap] = await Promise.all([
    fetchJSON<{ results: NamedAPIResource[] }>(
      `${POKEAPI_BASE_URL}/pokemon-species?limit=${TOTAL_POKEMON}&offset=0`
    ),
    getFrenchPokemonNameMap().catch(() => new Map<number, string>())
  ]);

  return response.results
    .map((entry) => {
      const id = extractIdFromUrl(entry.url);
      const displayName = frenchNameMap.get(id) ?? titleize(entry.name);

      return {
        id,
        name: entry.name,
        slug: entry.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        displayName,
        searchAliases: [displayName, titleize(entry.name), entry.name]
      };
    })
    .sort((left, right) => left.id - right.id);
}

export async function getPokemonCardsByIds(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

  if (!uniqueIds.length) {
    return [];
  }

  const [responses, frenchNameMap] = await Promise.all([
    Promise.all(uniqueIds.map((id) => fetchJSON<PokemonResponse>(`${POKEAPI_BASE_URL}/pokemon/${id}`))),
    getFrenchPokemonNameMap().catch(() => new Map<number, string>())
  ]);

  return responses
    .map((pokemon) => mapSummaryFromPokemon(pokemon, frenchNameMap.get(pokemon.id)))
    .sort((left, right) => ids.indexOf(left.id) - ids.indexOf(right.id));
}

export async function getPokemonIdsByType(type: PokemonTypeName) {
  const response = await fetchJSON<{
    pokemon: Array<{
      pokemon: NamedAPIResource;
    }>;
  }>(`${POKEAPI_BASE_URL}/type/${type}`);

  return response.pokemon
    .map((entry) => extractIdFromUrl(entry.pokemon.url))
    .filter((id) => id > 0 && id <= TOTAL_POKEMON);
}

async function getVarieties(species: PokemonSpeciesResponse, currentId: number): Promise<PokemonFormSummary[]> {
  const varietyIds = species.varieties
    .map((entry) => extractIdFromUrl(entry.pokemon.url))
    .filter((id) => id !== currentId)
    .slice(0, 6);

  if (!varietyIds.length) {
    return [];
  }

  const cards = await getPokemonCardsByIds(varietyIds);

  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    displayName: card.displayName,
    slug: card.slug,
    image: card.image,
    types: card.types
  }));
}

async function getSimilarPokemon(currentId: number, primaryType: PokemonTypeName) {
  const ids = await getPokemonIdsByType(primaryType);
  const candidates = ids
    .filter((id) => id !== currentId)
    .sort((left, right) => Math.abs(left - currentId) - Math.abs(right - currentId))
    .slice(0, 4);

  return getPokemonCardsByIds(candidates);
}

async function getNeighborSummary(id: number | null) {
  if (!id || id < 1 || id > TOTAL_POKEMON) {
    return null;
  }

  const [card] = await getPokemonCardsByIds([id]);
  return card ?? null;
}

export async function getPokemonDetail(slug: string): Promise<PokemonDetail> {
  const normalizedSlug = slug.toLowerCase();
  let species: PokemonSpeciesResponse;

  try {
    species = await fetchJSON<PokemonSpeciesResponse>(`${POKEAPI_BASE_URL}/pokemon-species/${normalizedSlug}`);
  } catch {
    const pokemonFallback = await fetchJSON<PokemonResponse>(`${POKEAPI_BASE_URL}/pokemon/${normalizedSlug}`);
    species = await fetchJSON<PokemonSpeciesResponse>(`${POKEAPI_BASE_URL}/pokemon-species/${pokemonFallback.species.name}`);
  }

  const defaultVarietyName =
    species.varieties.find((entry) => entry.is_default)?.pokemon.name ?? normalizedSlug;
  const pokemon = await fetchJSON<PokemonResponse>(`${POKEAPI_BASE_URL}/pokemon/${defaultVarietyName}`);

  const displayName = getPokemonDisplayName(pokemon.name, species.names);
  const types = pokemon.types
    .slice()
    .sort((left, right) => left.slot - right.slot)
    .map((entry) => entry.type.name as PokemonTypeName);
  const stats = mapPokemonStats(pokemon);
  const matchups = getTypeMatchups(types);
  const [abilities, evolutionChain, forms, similarPokemon, previous, next] = await Promise.all([
    getAbilityDetails(pokemon.abilities),
    fetchJSON<EvolutionChainResponse>(species.evolution_chain.url),
    getVarieties(species, pokemon.id),
    getSimilarPokemon(pokemon.id, types[0]),
    getNeighborSummary(pokemon.id - 1),
    getNeighborSummary(pokemon.id + 1)
  ]);

  const evolutionRoot = mapEvolutionNode(evolutionChain.chain);
  const femaleRatio = species.gender_rate === -1 ? null : (species.gender_rate / 8) * 100;
  const maleRatio = femaleRatio === null ? null : 100 - femaleRatio;
  const genderText =
    maleRatio === null || femaleRatio === null
      ? "Asexue"
      : `${maleRatio.toFixed(1)}% male · ${femaleRatio.toFixed(1)}% femelle`;

  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName,
    slug: pokemon.name,
    description: getDescription(species),
    genus: getGenus(species),
    generation: getGeneration(species),
    image: getArtworkFromPokemon(pokemon),
    shinyImage: getShinyArtworkFromPokemon(pokemon),
    sprite: pokemon.sprites.front_default,
    types,
    dominantType: types[0],
    height: formatMetersFromDecimeters(pokemon.height),
    weight: formatKilogramsFromHectograms(pokemon.weight),
    abilities,
    stats,
    totalStats: stats.reduce((total, stat) => total + stat.value, 0),
    weaknesses: matchups.weaknesses,
    resistances: matchups.resistances,
    immunities: matchups.immunities,
    evolutionPaths: buildEvolutionPaths(evolutionRoot),
    forms,
    similarPokemon,
    previous,
    next,
    gender: genderText,
    genderDistribution:
      maleRatio === null || femaleRatio === null
        ? null
        : {
            male: maleRatio,
            female: femaleRatio
          },
    effortValues: getEffortValues(stats),
    captureRate: getCaptureRateText(species.capture_rate),
    habitat: getHabitat(species),
    smogonUrl: `https://www.smogon.com/dex/sv/pokemon/${species.name}/`
  };
}

export async function getCarouselCards(centerId: number, radius = 4) {
  const ids: number[] = [];

  for (let id = Math.max(1, centerId - radius); id <= Math.min(TOTAL_POKEMON, centerId + radius); id += 1) {
    ids.push(id);
  }

  return getPokemonCardsByIds(ids);
}

export function getGenerationKeyForId(id: number) {
  return GENERATIONS.find((generation) => id >= generation.from && id <= generation.to)?.key ?? "all";
}

export function getMatchupLabel(type: PokemonTypeName) {
  return getLocalizedTypeLabel(type);
}
