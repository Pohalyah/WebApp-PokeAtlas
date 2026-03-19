import { PokedexExplorer } from "@/components/pokemon/pokedex-explorer";
import { getPokemonIndex } from "@/lib/pokemon-api";

export const metadata = {
  title: "Pokédex",
  description: "Recherche rapide, filtres utiles et cartes premium pour parcourir tous les Pokémon."
};

export const revalidate = 86400;

export default async function PokedexPage() {
  const index = await getPokemonIndex();

  return (
    <div className="page-shell py-8 sm:py-10">
      <PokedexExplorer index={index} />
    </div>
  );
}
