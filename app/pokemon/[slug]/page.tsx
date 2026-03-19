import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PokemonCommandCenter } from "@/components/pokemon/pokemon-command-center";
import { getPokemonDetail, getPokemonIndex } from "@/lib/pokemon-api";

export const revalidate = 86400;

interface PokemonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const pokemon = await getPokemonDetail(slug);

    return {
      title: pokemon.displayName,
      description: `${pokemon.displayName}, ${pokemon.generation ?? "Pokémon"} : types, stats, talents, faiblesses et évolutions en une fiche claire.`
    };
  } catch {
    return {
      title: "Pokémon introuvable"
    };
  }
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { slug } = await params;

  try {
    const pokemon = await getPokemonDetail(slug);
    const searchEntries = await getPokemonIndex();

    return <PokemonCommandCenter initialPokemon={pokemon} searchEntries={searchEntries} />;
  } catch {
    notFound();
  }
}
