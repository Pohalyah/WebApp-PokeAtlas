import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import "@/app/globals.css";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { adsenseClient } from "@/lib/adsense";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
  title: {
    default: "Atlas Pokedex",
    template: "%s | Atlas Pokedex"
  },
  verification: {
    google: "wxVYuiSqdStt6Uvl38taZjIS6sX19CsLOx6Alzm5SJg"
  },
  description:
    "Une encyclopedie Pokemon moderne, premium et centree sur l'essentiel : recherche rapide, fiche detail elegante et navigation fluide.",
  keywords: ["Pokemon", "Pokedex", "Next.js", "PokeAPI", "encyclopedie Pokemon", "Atlas Pokedex"],
  openGraph: {
    title: "Atlas Pokedex",
    description:
      "Une encyclopedie Pokemon moderne, premium et centree sur l'essentiel : recherche rapide, fiche detail elegante et navigation fluide.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>{adsenseClient ? <meta name="google-adsense-account" content={adsenseClient} /> : null}</head>
      <body className={`${bodyFont.variable} ${displayFont.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <FavoritesProvider>
            <div className="relative min-h-screen overflow-x-hidden">
              <AdSenseScript />
              <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(circle at top, var(--page-backdrop-highlight) 0%, var(--page-backdrop-mid) 36%, var(--app-bg) 100%)"
                }}
              />
              <div
                className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[28rem]"
                style={{
                  background: "radial-gradient(circle at top, var(--page-top-glow) 0%, transparent 58%)"
                }}
              />
              <div
                className="pointer-events-none fixed inset-y-0 left-0 -z-10 w-[20vw] min-w-[120px] opacity-90"
                style={{
                  background: "radial-gradient(circle at left center, var(--page-accent-left) 0%, transparent 72%)"
                }}
              />
              <div
                className="pointer-events-none fixed inset-y-0 right-0 -z-10 w-[20vw] min-w-[120px] opacity-90"
                style={{
                  background: "radial-gradient(circle at right center, var(--page-accent-right) 0%, transparent 72%)"
                }}
              />
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
              <ThemeSwitcher />
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
