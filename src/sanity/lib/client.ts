import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

function studioUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return siteUrl ? `${siteUrl}/studio` : "/studio";
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    studioUrl: studioUrl(),
  },
});
