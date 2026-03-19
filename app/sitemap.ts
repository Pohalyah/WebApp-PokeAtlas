import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      priority: 1
    },
    {
      url: `${baseUrl}/pokedex`,
      priority: 0.9
    },
    {
      url: `${baseUrl}/favorites`,
      priority: 0.5
    }
  ];
}
