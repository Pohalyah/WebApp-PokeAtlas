import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-skeletons";

export default function PokedexLoading() {
  return (
    <div className="page-shell space-y-5 py-8 sm:py-10">
      <div className="glass-panel h-20" />
      <div className="glass-panel h-24" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
