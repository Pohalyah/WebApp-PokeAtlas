import { SectionCard } from "@/components/ui/section-card";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Confidentialite",
  description: "Politique de confidentialite du site Atlas Pokedex."
};

export default function PrivacyPage() {
  return (
    <div className="page-shell space-y-6 py-8 sm:py-10">
      <SectionCard
        eyebrow="Donnees personnelles"
        title="Politique de confidentialite"
        description="Version adaptee au fonctionnement actuel du site. A completer si tu ajoutes plus tard analytics, publicites, compte utilisateur ou formulaire."
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
            Si tu ajoutes plus tard analytics, publicites personnalisees, newsletter ou formulaire, cette page devra etre completee avec les bases legales, durees de conservation, destinataires et droits applicables.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
