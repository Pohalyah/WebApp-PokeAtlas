"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";

import { WeaknessChart } from "@/components/pokemon/weakness-chart";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { SearchBar } from "@/components/ui/search-bar";
import { TypeBadge } from "@/components/ui/type-badge";
import { getTypeTheme } from "@/lib/pokemon-theme";
import type { PokemonDetail, PokemonIndexEntry } from "@/lib/types";
import { clamp, formatPokemonId, getPokemonSpriteUrl, titleize } from "@/lib/utils";

interface PokemonCommandCenterProps {
  initialPokemon: PokemonDetail;
  searchEntries: PokemonIndexEntry[];
}

const DESKTOP_CAROUSEL_WINDOW_SIZE = 7;
const MOBILE_CAROUSEL_WINDOW_SIZE = 5;
const WHEEL_DELTA_THRESHOLD = 6;
const WHEEL_STEP_COOLDOWN_MS = 120;
const SWIPE_STEP_THRESHOLD = 42;

function getEntryIndex(entries: PokemonIndexEntry[], pokemonId: number) {
  return Math.max(
    0,
    entries.findIndex((entry) => entry.id === pokemonId)
  );
}

function getEntryLabel(entry: PokemonIndexEntry) {
  return entry.displayName ?? titleize(entry.name);
}

function getVisibleEntries(entries: PokemonIndexEntry[], centerIndex: number, windowSize: number) {
  const halfWindow = Math.floor(windowSize / 2);
  let start = Math.max(0, centerIndex - halfWindow);
  let end = Math.min(entries.length, start + windowSize);

  if (end - start < windowSize) {
    start = Math.max(0, end - windowSize);
  }

  return entries.slice(start, end).map((entry, offset) => ({
    entry,
    absoluteIndex: start + offset
  }));
}

function CompactStat({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: string;
}) {
  const width = `${Math.min((value / 255) * 100, 100)}%`;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="font-medium theme-text-secondary">{label}</span>
        <span className="font-semibold theme-text-strong">{value}</span>
      </div>
      <div className="theme-track h-1.5 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full"
          style={{
            width,
            background: `linear-gradient(90deg, ${accent} 0%, var(--surface-elevated) 150%)`
          }}
        />
      </div>
    </div>
  );
}

export function PokemonCommandCenter({ initialPokemon, searchEntries }: PokemonCommandCenterProps) {
  const [selectedPokemon, setSelectedPokemon] = useState(initialPokemon);
  const [carouselIndex, setCarouselIndex] = useState(() => getEntryIndex(searchEntries, initialPokemon.id));
  const [searchValue, setSearchValue] = useState(initialPokemon.displayName);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [carouselWindowSize, setCarouselWindowSize] = useState(DESKTOP_CAROUSEL_WINDOW_SIZE);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const lastWheelStepAtRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastSyncedPokemonIdRef = useRef(initialPokemon.id);

  useEffect(() => {
    if (lastSyncedPokemonIdRef.current === initialPokemon.id) {
      return;
    }

    lastSyncedPokemonIdRef.current = initialPokemon.id;
    setSelectedPokemon(initialPokemon);
    setSearchValue(initialPokemon.displayName);
    setCarouselIndex(getEntryIndex(searchEntries, initialPokemon.id));
  }, [initialPokemon, searchEntries]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    function syncWindowSize() {
      setCarouselWindowSize(mediaQuery.matches ? MOBILE_CAROUSEL_WINDOW_SIZE : DESKTOP_CAROUSEL_WINDOW_SIZE);
    }

    syncWindowSize();
    mediaQuery.addEventListener("change", syncWindowSize);

    return () => {
      mediaQuery.removeEventListener("change", syncWindowSize);
    };
  }, []);

  useEffect(() => {
    const element = carouselRef.current;

    if (!element) {
      return;
    }

    function handleNativeWheel(event: WheelEvent) {
      const primaryDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(primaryDelta) < WHEEL_DELTA_THRESHOLD) {
        return;
      }

      event.preventDefault();
      const now = performance.now();

      if (now - lastWheelStepAtRef.current < WHEEL_STEP_COOLDOWN_MS) {
        return;
      }

      lastWheelStepAtRef.current = now;
      setCarouselIndex((current) =>
        clamp(current + (primaryDelta > 0 ? 1 : -1), 0, searchEntries.length - 1)
      );
    }

    element.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleNativeWheel);
    };
  }, [searchEntries.length]);

  const selectedTheme = getTypeTheme(selectedPokemon.dominantType);
  const secondaryTheme = selectedPokemon.types[1] ? getTypeTheme(selectedPokemon.types[1]) : null;
  const focusedEntry = searchEntries[carouselIndex] ?? searchEntries[0];
  const visibleEntries = getVisibleEntries(searchEntries, carouselIndex, carouselWindowSize);
  const inlineSurfaceClass = "border border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)]";
  const softSurfaceClass = "border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)]";

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-accent-left", selectedTheme.bg);
    root.style.setProperty("--page-accent-right", secondaryTheme?.bg ?? selectedTheme.bgSoft);

    return () => {
      root.style.setProperty("--page-accent-left", "rgba(226, 232, 240, 0.64)");
      root.style.setProperty("--page-accent-right", "rgba(241, 245, 249, 0.72)");
    };
  }, [secondaryTheme?.bg, selectedTheme.bg, selectedTheme.bgSoft]);

  async function loadPokemon(entry: PokemonIndexEntry) {
    const nextIndex = getEntryIndex(searchEntries, entry.id);

    setSearchValue(getEntryLabel(entry));
    setError(null);
    setCarouselIndex(nextIndex);

    if (entry.id === selectedPokemon.id) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/pokemon/${entry.slug}`);

      if (!response.ok) {
        throw new Error("Pokemon introuvable");
      }

      const data = (await response.json()) as { pokemon: PokemonDetail };

      startTransition(() => {
        setSelectedPokemon(data.pokemon);
      });
    } catch {
      setError("Impossible de charger ce Pokemon pour le moment.");
    } finally {
      setIsLoading(false);
    }
  }

  function moveCarousel(delta: number) {
    setCarouselIndex((current) => clamp(current + delta, 0, searchEntries.length - 1));
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current;

    if (!start) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < SWIPE_STEP_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    moveCarousel(deltaX > 0 ? -1 : 1);
  }

  return (
    <div className="page-shell py-2 sm:py-3 xl:py-2">
      <section
        className="relative overflow-hidden rounded-[30px] border border-[color:var(--panel-border)] p-2 shadow-sm sm:p-2.5 xl:min-h-[calc(100vh-78px)]"
        style={{
          background: secondaryTheme
            ? `linear-gradient(135deg, ${selectedTheme.bgSoft} 0%, var(--surface-elevated) 48%, ${secondaryTheme.bgSoft} 100%)`
            : `linear-gradient(180deg, ${selectedTheme.bgSoft} 0%, var(--surface-elevated) 100%)`
        }}
      >
        <div
          className="pointer-events-none absolute -inset-x-20 -inset-y-12 opacity-30"
          style={{
            background: secondaryTheme
              ? `radial-gradient(circle at 12% 42%, ${selectedTheme.bg} 0%, rgba(255,255,255,0) 28%), radial-gradient(circle at 88% 58%, ${secondaryTheme.bg} 0%, rgba(255,255,255,0) 30%)`
              : `radial-gradient(circle at 18% 38%, ${selectedTheme.bg} 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 82% 64%, ${selectedTheme.bgSoft} 0%, rgba(255,255,255,0) 32%)`
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-55"
          style={{
            background: secondaryTheme
              ? `linear-gradient(90deg, ${selectedTheme.bg} 0%, ${secondaryTheme.bg} 100%)`
              : `radial-gradient(circle at top center, ${selectedTheme.bg} 0%, rgba(255,255,255,0) 72%)`
          }}
        />

        <div className="relative grid gap-2.5 xl:grid-cols-[minmax(0,1.72fr)_292px]">
          <SearchBar
            className="xl:col-span-2"
            entries={searchEntries}
            value={searchValue}
            onValueChange={setSearchValue}
            onSelectEntry={(entry) => {
              void loadPokemon(entry);
            }}
            placeholder="Recherche instantanee par nom ou numero"
            compact
          />

          <section className="glass-panel xl:col-span-2 overflow-hidden px-2 py-2 sm:px-2.5">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-display text-[1.02rem] font-semibold tracking-tight theme-text-strong">Carrousel</h2>
                <div className="mt-1 space-y-1 text-xs theme-text-secondary sm:flex sm:flex-wrap sm:items-center sm:gap-1.5 sm:space-y-0">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="shrink-0">Affiche :</span>
                    <strong className="truncate theme-text-strong">
                      {formatPokemonId(selectedPokemon.id)} {selectedPokemon.displayName}
                    </strong>
                  </div>
                  <span className="hidden h-1 w-1 rounded-full bg-[color:var(--line-strong)] sm:block" />
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="shrink-0">Focus :</span>
                    <strong className="truncate theme-text-strong">
                      {formatPokemonId(focusedEntry.id)} {getEntryLabel(focusedEntry)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveCarousel(-1)}
                  className="theme-button-soft flex h-7 w-7 items-center justify-center rounded-2xl border transition-all duration-200 hover:border-[color:var(--line-strong)] hover:text-[color:var(--text-strong)]"
                  aria-label="Faire defiler vers la gauche"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCarousel(1)}
                  className="theme-button-soft flex h-7 w-7 items-center justify-center rounded-2xl border transition-all duration-200 hover:border-[color:var(--line-strong)] hover:text-[color:var(--text-strong)]"
                  aria-label="Faire defiler vers la droite"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="select-none touch-pan-x"
            >
              <div
                className="grid items-stretch gap-1.5"
                style={{
                  gridTemplateColumns: `repeat(${visibleEntries.length}, minmax(0, 1fr))`
                }}
              >
                {visibleEntries.map(({ entry, absoluteIndex }) => {
                  const isFocused = absoluteIndex === carouselIndex;
                  const isDisplayed = entry.id === selectedPokemon.id;
                  const label = getEntryLabel(entry);

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        void loadPokemon(entry);
                      }}
                      className={`relative min-w-0 rounded-[14px] border px-1 py-1 text-center transition-all duration-200 sm:rounded-[18px] sm:px-1.5 sm:py-1.5 ${
                        isFocused
                          ? "z-10 -translate-y-0.5 border-[color:var(--carousel-active-bg)] bg-[color:var(--carousel-active-bg)] text-[color:var(--carousel-active-text)] shadow-md"
                          : "border-[color:var(--line-soft)] bg-[color:var(--surface-elevated)] text-[color:var(--text-secondary)] hover:border-[color:var(--line-strong)]"
                      }`}
                    >
                      {isDisplayed ? (
                        <span className="absolute right-1 top-1 hidden rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white sm:inline-flex">
                          Actif
                        </span>
                      ) : null}

                      <div className="min-w-0">
                        <p
                          className={`text-[8px] font-semibold uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.14em] ${
                            isFocused ? "text-[color:var(--carousel-active-muted)]" : "theme-text-muted"
                          }`}
                        >
                          {formatPokemonId(entry.id)}
                        </p>
                        <div className="mt-1 flex items-center justify-center sm:mt-1.5">
                          <Image
                            src={getPokemonSpriteUrl(entry.id)}
                            alt={label}
                            width={56}
                            height={56}
                            className={`object-contain transition-transform duration-200 ${
                              isFocused
                                ? "h-10 w-10 scale-105 sm:h-[56px] sm:w-[56px] sm:scale-105"
                                : isDisplayed
                                  ? "h-8 w-8 scale-100 sm:h-[46px] sm:w-[46px]"
                                  : "h-7 w-7 scale-95 sm:h-10 sm:w-10"
                            }`}
                          />
                        </div>
                        <p className="mt-1 min-h-[20px] text-[8px] font-semibold leading-tight tracking-tight sm:mt-1 sm:min-h-[22px] sm:text-[11px]">
                          {label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid content-start gap-2.5">
            <section className="glass-panel p-2.5 sm:p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-[1.02rem] font-semibold tracking-tight theme-text-strong">Tableau des faiblesses</h2>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium theme-text-secondary ${inlineSurfaceClass}`}>
                  {selectedPokemon.displayName}
                </span>
              </div>

              <WeaknessChart
                weaknesses={selectedPokemon.weaknesses}
                resistances={selectedPokemon.resistances}
                immunities={selectedPokemon.immunities}
              />
            </section>

            <section className="glass-panel p-2.5 sm:p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-[1.02rem] font-semibold tracking-tight theme-text-strong">Stats de base</h2>
                </div>
                <div className={`rounded-[16px] px-2.5 py-1 text-right ${inlineSurfaceClass}`}>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] theme-text-muted">Total</p>
                  <p className="text-base font-semibold tracking-tight theme-text-strong">{selectedPokemon.totalStats}</p>
                </div>
              </div>

              <div className="grid gap-x-4 gap-y-1.5 md:grid-cols-2">
                {selectedPokemon.stats.map((stat) => (
                  <CompactStat key={stat.key} label={stat.label} value={stat.value} accent={selectedTheme.accent} />
                ))}
              </div>
            </section>

            <a
              href={selectedPokemon.smogonUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-between rounded-[20px] px-3 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-[color:var(--text-strong)] ${inlineSurfaceClass} theme-text-secondary`}
            >
              <span>Analyse Smogon</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <aside className="grid content-start gap-2.5">
            <section className="glass-panel p-2.5 sm:p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] theme-text-secondary ${inlineSurfaceClass}`}>
                      {formatPokemonId(selectedPokemon.id)}
                    </span>
                    {selectedPokemon.generation ? (
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium theme-text-secondary ${inlineSurfaceClass}`}>
                        {selectedPokemon.generation}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="mt-2 font-display text-[1.8rem] font-semibold tracking-tight theme-text-strong">
                    {selectedPokemon.displayName}
                  </h1>
                  {selectedPokemon.genus ? (
                    <p className="mt-1 text-sm theme-text-secondary">{selectedPokemon.genus}</p>
                  ) : null}
                </div>

                <FavoriteButton pokemonId={selectedPokemon.id} />
              </div>
            </section>

            <section className="glass-panel relative p-2.5 sm:p-3">
              {isLoading || isPending ? (
                <div className="theme-overlay absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
                  <div className="theme-button-solid flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement
                  </div>
                </div>
              ) : null}

              <div
                className="pointer-events-none absolute inset-x-5 top-3 h-16 rounded-full opacity-60 blur-2xl"
                style={{
                  background: `radial-gradient(circle at center, ${selectedTheme.bg} 0%, rgba(255,255,255,0) 72%)`
                }}
              />

              <div className="relative grid gap-2.5">
                <div className={`rounded-[18px] p-2.5 ${inlineSurfaceClass}`}>
                  <p className="text-sm font-semibold theme-text-strong">Types et visuel</p>

                  <div className="mt-2.5 flex items-end justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPokemon.types.map((type) => (
                          <TypeBadge key={type} type={type} className="px-3 py-1.5 text-[11px]" />
                        ))}
                      </div>

                      <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[11px] font-medium theme-text-secondary ${softSurfaceClass}`}>
                        <span className="uppercase tracking-[0.14em] theme-text-muted">Sprite</span>
                        <Image
                          src={selectedPokemon.sprite ?? getPokemonSpriteUrl(selectedPokemon.id)}
                          alt={`${selectedPokemon.displayName} sprite`}
                          width={40}
                          height={40}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    </div>

                    <div className={`relative flex h-28 w-28 shrink-0 items-end justify-end overflow-hidden rounded-[18px] p-1.5 ${softSurfaceClass}`}>
                      <div
                        className="absolute inset-0 opacity-70"
                        style={{
                          background: `radial-gradient(circle at center, ${selectedTheme.bg} 0%, rgba(255,255,255,0) 70%)`
                        }}
                      />
                      <Image
                        src={selectedPokemon.image}
                        alt={selectedPokemon.displayName}
                        width={160}
                        height={160}
                        priority
                        className="relative h-24 w-24 object-contain drop-shadow-[0_12px_22px_rgba(15,23,42,0.16)]"
                      />
                    </div>
                  </div>
                </div>

                <div className={`rounded-[18px] p-2.5 ${inlineSurfaceClass}`}>
                  <p className="text-sm font-semibold theme-text-strong">Talents</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedPokemon.abilities.map((ability) => (
                      <div
                        key={ability.name}
                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[13px] ${
                          ability.isHidden
                            ? "hidden-ability-chip"
                            : `${softSurfaceClass} theme-text-primary`
                        }`}
                      >
                        <span className="font-medium">{ability.displayName}</span>
                        {ability.isHidden ? (
                          <span className="hidden-ability-pill rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]">
                            Cache
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                  <div className={`rounded-[18px] p-2.5 ${inlineSurfaceClass}`}>
                    <p className="text-sm font-semibold theme-text-strong">EV</p>
                    <p className="mt-1.5 text-sm font-medium leading-6 theme-text-primary">
                      {selectedPokemon.effortValues.length ? selectedPokemon.effortValues.join(" · ") : "Aucun EV notable"}
                    </p>
                  </div>

                  <div className={`rounded-[18px] p-2.5 ${inlineSurfaceClass}`}>
                    <p className="text-sm font-semibold theme-text-strong">Sexe</p>
                    {selectedPokemon.genderDistribution ? (
                      <div className="mt-2 space-y-1.5">
                        <div className="theme-track h-2 overflow-hidden rounded-full">
                          <div className="flex h-full w-full">
                            <div
                              className="h-full bg-sky-200"
                              style={{
                                width: `${selectedPokemon.genderDistribution.male}%`
                              }}
                            />
                            <div
                              className="h-full bg-rose-200"
                              style={{
                                width: `${selectedPokemon.genderDistribution.female}%`
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] theme-text-secondary">
                          <span className="inline-flex rounded-full bg-sky-500/14 px-2 py-0.5 font-semibold text-sky-300">
                            {selectedPokemon.genderDistribution.male.toFixed(1)}% male
                          </span>
                          <span className="inline-flex rounded-full bg-rose-500/14 px-2 py-0.5 font-semibold text-rose-300">
                            {selectedPokemon.genderDistribution.female.toFixed(1)}% femelle
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1.5 text-sm font-medium theme-text-primary">{selectedPokemon.gender}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {error ? (
          <div className="relative mt-2.5 rounded-[20px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
      </section>
    </div>
  );
}
