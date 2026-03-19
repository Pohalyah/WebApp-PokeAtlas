import { SectionCard } from "@/components/ui/section-card";
import { adsenseClient } from "@/lib/adsense";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Confidentialite",
  description: "Politique de confidentialite du site Atlas Pokedex."
};

export default function PrivacyPage() {
  const hasAdsense = Boolean(adsenseClient);

  return (
    <div className="page-shell space-y-6 py-8 sm:py-10">
      <SectionCard
        eyebrow="Donnees personnelles"
        title="Politique de confidentialite"
        description="Version adaptee au fonctionnement actuel du site et a la monetisation via Google AdSense. A completer si tu ajoutes plus tard d autres outils tiers ou des comptes utilisateurs."
      >
        <div className="space-y-4 text-sm leading-7 theme-text-secondary">
          <p>
            Atlas Pokedex ne propose actuellement ni creation de compte, ni espace membre, ni collecte directe de donnees personnelles via formulaire.
          </p>
          <p>
            Le site utilise uniquement des mecanismes techniques locaux au navigateur pour stocker certaines preferences utilisateur, comme les favoris et le choix de theme.
          </p>
          <p>
            Les donnees encyclopediques Pokemon affichees sur le site sont recuperees depuis des sources externes publiques, notamment PokeAPI, et ne constituent pas des donnees personnelles.
          </p>
          {hasAdsense ? (
            <p>
              Le site peut egalement afficher des annonces via Google AdSense. Selon la localisation du visiteur et ses choix de consentement, Google et ses partenaires peuvent traiter certaines donnees techniques, cookies ou elements de stockage local pour afficher, mesurer et securiser les annonces.
            </p>
          ) : (
            <p>
              Google AdSense n est pas encore active sur le site. Si tu actives la monetisation plus tard, cette page devra rester alignee avec la configuration publicitaire et le recueil du consentement.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard eyebrow="Stockage local" title="Donnees conservees dans le navigateur">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] p-5">
            <p className="text-sm font-semibold theme-text-strong">Favoris</p>
            <p className="mt-3 text-sm leading-7 theme-text-secondary">
              Cle locale utilisee: <code className="rounded bg-[color:var(--accent-soft)] px-2 py-1">atlas-pokedex:favorites</code>
            </p>
            <p className="mt-2 text-sm leading-7 theme-text-secondary">
              Finalite: memoriser les Pokemon ajoutes en favoris sur le meme navigateur et le meme appareil.
            </p>
          </div>

          <div className="rounded-[22px] border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] p-5">
            <p className="text-sm font-semibold theme-text-strong">Theme</p>
            <p className="mt-3 text-sm leading-7 theme-text-secondary">
              Cle locale utilisee: <code className="rounded bg-[color:var(--accent-soft)] px-2 py-1">atlas-pokedex:theme-mode</code>
            </p>
            <p className="mt-2 text-sm leading-7 theme-text-secondary">
              Finalite: conserver le choix Jour, Nuit ou Systeme entre deux visites.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Contact" title="Responsable de traitement et contact">
        <div className="space-y-3 text-sm leading-7 theme-text-secondary">
          <p>
            Responsable de publication: <span className="theme-text-primary">{siteConfig.legal.publisherName}</span>
          </p>
          <p>
            Contact: <span className="theme-text-primary">{siteConfig.legal.contactEmail}</span>
          </p>
          <p>
            Pour les visiteurs situes dans l EEE, au Royaume-Uni et en Suisse, le recueil du consentement doit etre gere via une CMP compatible TCF lorsque des publicites Google sont actives.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
