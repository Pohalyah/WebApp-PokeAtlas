import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { EvolutionChain } from "@/components/pokemon/evolution-chain";
import { HeroHeader } from "@/components/pokemon/hero-header";
import { PokemonCarousel } from "@/components/pokemon/pokemon-carousel";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { WeaknessChart } from "@/components/pokemon/weakness-chart";
import { InfoPanel } from "@/components/ui/info-panel";
import { SectionCard } from "@/components/ui/section-card";
import { StatBar } from "@/components/ui/stat-bar";
import { TypeBadge } from "@/components/ui/type-badge";
import { getTypeTheme } from "@/lib/pokemon-theme";
import type { PokemonCardSummary, PokemonDetail, PokemonIndexEntry } from "@/lib/types";

interface PokemonDetailShellProps {
  pokemon: PokemonDetail;
  carouselItems: PokemonCardSummary[];
  searchEntries: PokemonIndexEntry[];
}

export function PokemonDetailShell({ pokemon, carouselItems, searchEntries }: PokemonDetailShellProps) {
  const theme = getTypeTheme(pokemon.dominantType);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b ${theme.gradient} pb-14 pt-8 sm:pb-16 sm:pt-10`}
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${theme.bg} 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, rgba(255,255,255,0.5), rgba(248,250,252,0.95))`
      }}
    >
      <div className="page-shell space-y-6">
        <PokemonCarousel items={carouselItems} selectedPokemonId={pokemon.id} searchEntries={searchEntries} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="space-y-6">
            <HeroHeader pokemon={pokemon} />

            <SectionCard
              eyebrow="Zone 6"
              title="Matchups essentiels"
              description="Lecture rapide des faiblesses, résistances et immunités pour comprendre immédiatement le profil défensif."
            >
              <WeaknessChart
                weaknesses={pokemon.weaknesses}
                resistances={pokemon.resistances}
                immunities={pokemon.immunities}
              />
            </SectionCard>

            <SectionCard
              eyebrow="Zone 13"
              title="Stats de base"
              description="Visualisation claire, sans tableau lourd, avec accent sur le rythme et la lisibilité."
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                  {pokemon.stats.map((stat) => (
                    <StatBar key={stat.key} label={stat.label} value={stat.value} accent={theme.accent} />
                  ))}
                </div>
                <div className="space-y-4 rounded-[26px] border border-slate-200/80 bg-white/[0.88] p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Lecture rapide</p>
                    <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950">
                      Total {pokemon.totalStats}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    Un profil pensé pour être consulté en quelques secondes, avec uniquement les valeurs les plus utiles.
                  </p>
                  <div className="grid gap-3">
                    <InfoPanel label="Sexe" value={pokemon.gender} />
                    <InfoPanel
                      label="Capture"
                      value={pokemon.captureRate ?? "Variable"}
                      hint={pokemon.habitat ? `Habitat ${pokemon.habitat}` : null}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Zone 12"
              title="Chaîne d’évolution"
              description="Une lecture visuelle simple, même pour les évolutions multiples ou ramifiées."
            >
              <EvolutionChain paths={pokemon.evolutionPaths} selectedId={pokemon.id} />
            </SectionCard>

            {pokemon.forms.length ? (
              <SectionCard
                eyebrow="Variantes"
                title="Formes et alternatives"
                description="Les formes utiles sont regroupées ici pour éviter les détours et les listes infinies."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {pokemon.forms.map((form) => (
                    <article key={form.id} className="rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                      <Link href={`/pokemon/${form.slug}`} className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-slate-50">
                          <Image src={form.image} alt={form.displayName} width={88} height={88} className="h-16 w-16 object-contain" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-display text-lg font-semibold tracking-tight text-slate-950">{form.displayName}</p>
                          <div className="flex flex-wrap gap-2">
                            {form.types.map((type) => (
                              <TypeBadge key={type} type={type} />
                            ))}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {pokemon.similarPokemon.length ? (
              <SectionCard
                eyebrow="Suggestions"
                title="Pokémon similaires"
                description="Quelques profils proches par type ou affinité générale pour prolonger l’exploration."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {pokemon.similarPokemon.map((item) => (
                    <PokemonCard key={item.id} pokemon={item} />
                  ))}
                </div>
              </SectionCard>
            ) : null}

            <SectionCard eyebrow="Zone 7" title="Ressource complémentaire">
              <a
                href={pokemon.smogonUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-950">Voir l’analyse stratégique sur Smogon</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Pour aller plus loin côté compétitif, sans surcharger cette fiche.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  Ouvrir le guide
                  <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            </SectionCard>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <SectionCard className="overflow-visible" contentClassName="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <InfoPanel label="Numéro" value={pokemon.id.toString()} />
                <InfoPanel label="Génération" value={pokemon.generation ?? "Non définie"} />
              </div>

              <div
                className="relative overflow-hidden rounded-[30px] border border-slate-200/80 px-4 py-6"
                style={{
                  background: `linear-gradient(180deg, ${theme.bgSoft} 0%, white 100%)`
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-6 top-4 h-40 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${theme.bg} 0%, rgba(255,255,255,0) 70%)`
                  }}
                />
                <div className="relative flex items-center justify-center">
                  <Image
                    src={pokemon.image}
                    alt={pokemon.displayName}
                    width={320}
                    height={320}
                    priority
                    className="h-64 w-64 object-contain drop-shadow-[0_24px_36px_rgba(15,23,42,0.2)]"
                  />
                </div>
                {pokemon.shinyImage ? (
                  <div className="mt-4 rounded-[22px] border border-white/80 bg-white/[0.88] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Version shiny</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Image src={pokemon.shinyImage} alt={`${pokemon.displayName} shiny`} width={72} height={72} className="h-16 w-16 object-contain" />
                      <p className="text-sm leading-6 text-slate-600">Une variante visuelle mise en avant sans alourdir la fiche.</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3">
                <div className="rounded-[24px] border border-slate-200/80 bg-white/[0.88] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Types</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pokemon.types.map((type) => (
                      <TypeBadge key={type} type={type} className="px-4 py-2 text-sm" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoPanel label="Taille" value={pokemon.height} />
                  <InfoPanel label="Poids" value={pokemon.weight} />
                </div>

                <div className="rounded-[24px] border border-slate-200/80 bg-white/[0.88] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Talents</p>
                  <div className="mt-4 space-y-3">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.name}
                        className={
                          ability.isHidden
                            ? "hidden-ability-chip rounded-[20px] border p-3"
                            : "rounded-[20px] border border-slate-100 bg-slate-50/80 p-3"
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-950">{ability.displayName}</p>
                          {ability.isHidden ? (
                            <span className="hidden-ability-pill rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                              Caché
                            </span>
                          ) : null}
                        </div>
                        {ability.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{ability.description}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>

                <InfoPanel label="Sexe" value={pokemon.gender} />

                <InfoPanel
                  label="Effort value"
                  value={pokemon.effortValues.length ? pokemon.effortValues.join(" · ") : "Aucun EV notable"}
                />
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
