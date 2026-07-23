import { pathFromSlug } from "@tylerlirette/pagebuilder";
import { allPageSlugsQuery } from "@tylerlirette/pagebuilder/next";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { sanityFetch } from "@/sanity/lib/live";

export const revalidate = 60;

type PageSlugRow = {
  slug: string;
  _updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  let pages: PageSlugRow[] = [{ slug: "/" }];
  try {
    const { data: rows } = await sanityFetch({
      query: allPageSlugsQuery,
      perspective: "published",
      stega: false,
    });
    if (rows?.length) {
      pages = rows;
    }
  } catch {
    // Keep homepage entry when Sanity is unreachable at build time.
  }

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    const path = pathFromSlug(page.slug);
    if (seen.has(path)) {
      continue;
    }
    seen.add(path);

    entries.push({
      url: new URL(path, baseUrl).toString(),
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.7,
    });
  }

  if (!seen.has("/")) {
    entries.unshift({
      url: new URL("/", baseUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  return entries;
}
