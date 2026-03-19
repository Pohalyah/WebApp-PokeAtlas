const rawAdsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export const adsenseClient = rawAdsenseClient || null;
export const adsensePublisherId = adsenseClient?.replace(/^ca-/, "") ?? null;
export const isAdsenseEnabled = process.env.NODE_ENV === "production" && Boolean(adsenseClient);
