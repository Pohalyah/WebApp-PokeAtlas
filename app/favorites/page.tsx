import { FavoritesGrid } from "@/components/pokemon/favorites-grid";
import { SectionCard } from "@/components/ui/section-card";

export const metadata = {
  title: "Favoris",
  description: "Retrouve rapidement les Pokémon que tu as mis de côté."
};

export default function FavoritesPage() {
  return (
    <div className="page-shell space-y-6 py-8 sm:py-10">
      <SectionCard
        eyebrow="Collection"
        title="Tes Pokémon favoris"
        description="Une sélection personnelle stockée en local, pensée pour revenir vite sur tes fiches préférées."
      >
        <FavoritesGrid />
      </SectionCard>
    </div>
  );
}
