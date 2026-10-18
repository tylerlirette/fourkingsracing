import {
  createGetPageBySlug,
  createGetSiteSettings,
  getReadToken,
} from "@tylerlirette/pagebuilder/next";
import { createPagebuilderClient } from "@tylerlirette/pagebuilder/next/client";
import { createPagebuilderLive } from "@tylerlirette/pagebuilder/next/live";
import { siteDefaults } from "@/lib/siteDefaults";

export const client = createPagebuilderClient();

export const { sanityFetch, SanityLive } = createPagebuilderLive({
  client,
  token: getReadToken(),
});

export const getSiteSettings = createGetSiteSettings({
  sanityFetch,
  defaults: siteDefaults,
});

export const getPageBySlug = createGetPageBySlug({
  sanityFetch,
  getSiteSettings,
});
