import { SectionCard } from "@/components/ui/section-card";

export const metadata = {
  title: "Cookies",
  description: "Informations sur les cookies et le stockage local utilises par Atlas Pokedex."
};

export default function CookiesPage() {
  return (
    <div className="page-shell space-y-6 py-8 sm:py-10">
      <SectionCard
        eyebrow="Cookies et stockage"
        title="Politique cookies"
        description="Etat actuel du site: pas de regie publicitaire active ni outil analytics additionnel. Cette page devra etre enrichie si tu ajoutes plus tard publicites, mesure d audience ou scripts tiers."
      >
        <div className="space-y-4 text-sm leading-7 theme-text-secondary">
          <p>
            A ce jour, Atlas Pokedex utilise principalement du stockage local navigateur pour memoriser certaines preferences utiles a l experience utilisateur.
          </p>
          <p>
            Aucun bandeau cookies complexe n est encore necessaire tant que tu n actives ni publicites personnalisees, ni analytics tiers, ni outils marketing supplementaires.
          </p>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Elements techniques" title="Ce que le site utilise actuellement">
        <div className="space-y-3 text-sm leading-7 theme-text-secondary">
          <p>
            <strong className="theme-text-strong">Favoris:</strong> enregistrement local des Pokemon preferes sur le navigateur.
          </p>
          <p>
            <strong className="theme-text-strong">Theme:</strong> memorisation du mode Jour, Nuit ou Systeme.
          </p>
          <p>
            <strong className="theme-text-strong">Hebergement:</strong> des cookies techniques ou journaux serveur peuvent etre geres par l infrastructure d hebergement pour assurer le fonctionnement du service.
          </p>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Evolution future" title="Si tu ajoutes des pubs ou de la mesure d audience">
        <div className="space-y-4 text-sm leading-7 theme-text-secondary">
          <p>
            Si tu ajoutes Google AdSense, Google Analytics ou tout autre script tiers, cette page devra etre mise a jour avec la liste des traceurs, leur finalite et leur duree de conservation.
          </p>
          <p>
            Pour la France et l Union europeenne, une solution de consentement conforme sera alors necessaire avant le depot de certains traceurs non essentiels.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
