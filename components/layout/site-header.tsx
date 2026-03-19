"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Sparkles } from "lucide-react";

import { useFavorites } from "@/components/providers/favorites-provider";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/pokedex", label: "Pokedex" },
  { href: "/favorites", label: "Favoris" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  return (
    <header className="site-header-shell sticky top-0 z-40 shadow-sm">
      <div className="page-shell py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="group flex items-center gap-3">
            <div className="theme-button-solid flex h-10 w-10 items-center justify-center rounded-2xl shadow-card transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-base font-semibold tracking-tight theme-text-strong">Atlas Pokedex</p>
              <p className="text-xs theme-text-secondary">Vue rapide Pokemon</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "theme-button-solid shadow-card"
                      : "theme-text-secondary hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-strong)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/favorites"
            className="theme-button-soft inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:border-[color:var(--line-strong)] hover:text-[color:var(--text-strong)]"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favoris</span>
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold theme-surface-soft theme-text-strong">
              {favorites.length}
            </span>
          </Link>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive ? "theme-button-solid shadow-card" : "theme-button-soft border"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
