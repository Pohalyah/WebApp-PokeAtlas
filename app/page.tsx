import { PokemonCommandCenter } from "@/components/pokemon/pokemon-command-center";
import { getPokemonDetail, getPokemonIndex } from "@/lib/pokemon-api";

export const revalidate = 86400;

export default async function HomePage() {
  const [index, initialPokemon] = await Promise.all([
    getPokemonIndex(),
    getPokemonDetail("1")
  ]);

  return <PokemonCommandCenter initialPokemon={initialPokemon} searchEntries={index} />;
}
