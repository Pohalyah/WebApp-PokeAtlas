import { SectionCard } from "@/components/ui/section-card";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Mentions legales",
  description: "Informations legales et hebergement du site Atlas Pokedex."
};

export default function LegalNoticePage() {
  const legal = siteConfig.legal;

  return (
    <div className="page-shell space-y-6 py-8 sm:py-10">
      <SectionCard
        eyebrow="Informations legales"
        title="Mentions legales"
        description="Base legale prete a completer pour la publication du site. Les champs marques 'A completer' doivent etre remplaces par tes informations reelles avant une mise en ligne definitive."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] p-5">
            <p className="text-sm font-semibold theme-text-strong">Editeur du site</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="theme-text-muted">Nom ou raison sociale</dt>
                <dd className="mt-1 theme-text-primary">{legal.publisherName}</dd>
              </div>
              <div>
                <dt className="theme-text-muted">Statut</dt>
                <dd className="mt-1 theme-text-primary">{legal.publisherStatus}</dd>
              </div>
              <div>
                <dt className="theme-text-muted">Directeur de la publication</dt>
                <dd className="mt-1 theme-text-primary">{legal.publicationDirector}</dd>
              </div>
              <div>
                <dt className="theme-text-muted">Adresse email</dt>
                <dd className="mt-1 theme-text-primary">{legal.contactEmail}</dd>
              </div>
              <div>
                <dt className="theme-text-muted">Adresse postale</dt>
                <dd className="mt-1 theme-text-primary">{legal.postalAddress}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[22px] border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] p-5">
            <p className="text-sm font-semibold theme-text-strong">Hebergement</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="theme-text-muted">Hebergeur</dt>
                <dd className="mt-1 theme-text-primary">{legal.hostName}</dd>
              </div>
              <div>
                <dt className="theme-text-muted">Site web</dt>
                <dd className="mt-1 theme-text-primary">
                  <a href={legal.hostWebsite} target="_blank" rel="noreferrer" className="hover:underline">
                    {legal.hostWebsite}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="theme-text-muted">Informations complementaires</dt>
                <dd className="mt-1 theme-text-primary">{legal.hostAddress}</dd>
              </div>
            </dl>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Propriete intellectuelle"
        title="Contenus et marques"
        description="Cette section clarifie ce qui releve du site et ce qui releve de tiers."
      >
        <div className="space-y-4 text-sm leading-7 theme-text-secondary">
          <p>
            Le design, la structure de navigation et les composants de cette web app sont fournis pour Atlas Pokedex.
          </p>
          <p>
            Les donnees Pokemon affichees proviennent de PokeAPI. Les noms, creature designs, marques et elements lies a la licence Pokemon demeurent la propriete de leurs ayants droit respectifs.
          </p>
          <p>
            Ce site a une vocation encyclopedique et informative. Si tu ajoutes des contenus editoriaux, illustrations ou assets supplementaires, pense a verifier les droits associes avant publication.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
