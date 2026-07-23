import type { Metadata } from "next";
import {
  buildGoogleFontsStylesheetUrl,
  globalStylesToCssProperties,
  mergeGlobalStyles,
  mergeSiteFooter,
  mergeSiteHeader,
  buildSiteDefaultMetadata,
} from "@tylerlirette/pagebuilder";
import { SiteFooter, SiteHeader } from "@tylerlirette/pagebuilder/ui";
import {
  globalStylesQuery,
  siteFooterQuery,
  siteHeaderQuery,
} from "@tylerlirette/pagebuilder/next";
import { getSiteSettings, sanityFetch } from "@/sanity/lib/live";
import "../globals.css";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildSiteDefaultMetadata(settings);
}

async function getGlobalStyles() {
  try {
    const { data } = await sanityFetch({
      query: globalStylesQuery,
      stega: false,
    });
    return mergeGlobalStyles(data);
  } catch {
    return mergeGlobalStyles(null);
  }
}

async function getSiteHeader(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  try {
    const { data } = await sanityFetch({
      query: siteHeaderQuery,
    });
    return mergeSiteHeader(data, settings);
  } catch {
    return mergeSiteHeader(null, settings);
  }
}

async function getSiteFooter(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  try {
    const { data } = await sanityFetch({
      query: siteFooterQuery,
    });
    return mergeSiteFooter(data, settings);
  } catch {
    return mergeSiteFooter(null, settings);
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const [globalStyles, siteHeader, siteFooter] = await Promise.all([
    getGlobalStyles(),
    getSiteHeader(settings),
    getSiteFooter(settings),
  ]);
  const googleFontsHref = buildGoogleFontsStylesheetUrl(globalStyles.typography);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={googleFontsHref} rel="stylesheet" />
      <div
        data-type-scale={globalStyles.typography.typeScale}
        data-roundedness={globalStyles.roundedness}
        className="site-root min-h-full flex flex-col font-sans antialiased scroll-smooth"
        style={globalStylesToCssProperties(globalStyles)}
      >
        <SiteHeader config={siteHeader} />
        {children}
        <SiteFooter config={siteFooter} />
      </div>
    </>
  );
}
