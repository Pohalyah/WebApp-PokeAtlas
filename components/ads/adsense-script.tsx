import Script from "next/script";

import { adsenseClient, isAdsenseEnabled } from "@/lib/adsense";

export function AdSenseScript() {
  if (!isAdsenseEnabled || !adsenseClient) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
      strategy="afterInteractive"
    />
  );
}
