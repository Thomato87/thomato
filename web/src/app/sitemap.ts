import { MetadataRoute } from "next";
import { brand } from "@/data/brand";
import { rechnerUrl } from "@/data/rechner";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: brand.meta.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: rechnerUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
