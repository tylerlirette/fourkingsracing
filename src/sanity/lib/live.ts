import { defineLive } from "next-sanity/live";
import {
  createGetPageBySlug,
  createGetSiteSettings,
} from "@tylerlirette/pagebuilder/next";
import { siteDefaults } from "@/lib/siteDefaults";
import { client } from "./client";
import { token } from "./token";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token || false,
  browserToken: token || false,
});

export const getSiteSettings = createGetSiteSettings({
  sanityFetch,
  defaults: siteDefaults,
});

export const getPageBySlug = createGetPageBySlug({
  sanityFetch,
  getSiteSettings,
});
