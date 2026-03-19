import { SectionCard } from "@/components/ui/section-card";
import { adsenseClient } from "@/lib/adsense";

export const metadata = {
  title: "Cookies",
  description: "Informations sur les cookies et le stockage local utilises par Atlas Pokedex."
};

export default function CookiesPage() {
  const hasAdsense = Boolean(adsenseClient);

  return (
    <div className="page-shell space-y-6 py-8 sm:py-10">
      <SectionCard
        eyebrow="Cookies et stockage"
        title="Politique cookies"
        description={
          hasAdsense
            ? "Le site peut utiliser des technologies de stockage local et des cookies publicitaires, sous reserve des choix de consentement de l utilisateur."
            : "Etat actuel du site: stockage local pour les preferences utilisateur, sans regie publicitaire active tant qu AdSense n est pas configure."
        }
      >
        <div className="space-y-4 text-sm leading-7 theme-text-secondary">
          <p>
            A ce jour, Atlas Pokedex utilise principalement du stockage local navigateur pour memoriser certaines preferences utiles a l experience utilisateur.
          </p>
          {hasAdsense ? (
            <p>
              Lorsque Google AdSense est active, certains cookies ou mecanismes equivalents peuvent etre utilises pour diffuser, mesurer et proteger les annonces, en fonction du pays du visiteur et de ses choix dans le message de consentement.
            </p>
          ) : (
            <p>
              Aucun bandeau cookies publicitaire n est necessaire tant que tu n actives ni publicites, ni analytics tiers, ni outils marketing supplementaires.
            </p>
          )}
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
          {hasAdsense ? (
            <p>
              <strong className="theme-text-strong">Google AdSense:</strong> si la monetisation est activee, Google peut deposer ou lire des traceurs publicitaires apres recueil du consentement lorsque celui-ci est requis.
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard eyebrow="Evolution future" title="Si tu ajoutes des pubs ou de la mesure d audience">
        <div className="space-y-4 text-sm leading-7 theme-text-secondary">
          <p>
            Si tu ajoutes Google Analytics ou tout autre script tiers supplementaire, cette page devra etre mise a jour avec la liste des traceurs, leur finalite et leur duree de conservation.
          </p>
          <p>
            Pour la France, l Union europeenne, le Royaume-Uni et la Suisse, une solution de consentement compatible TCF et certifiee Google est necessaire avant le depot de certains traceurs non essentiels lies aux annonces.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
