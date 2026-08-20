import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.toString(),
      lastModified: new Date("2026-08-20"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/cookies", siteUrl).toString(),
      lastModified: new Date("2026-08-20"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
