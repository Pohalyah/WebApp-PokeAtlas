import type { MetadataRoute } from "next";

import { getPokemonIndex } from "@/lib/pokemon-api";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pokemonIndex = await getPokemonIndex();
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/pokedex`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9
    },
    ...pokemonIndex.map((pokemon) => ({
      url: `${baseUrl}/pokemon/${pokemon.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
