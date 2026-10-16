import type { Metadata } from "next";
import {
  buildGoogleFontsStylesheetUrl,
  globalStylesToCssProperties,
  mergeGlobalStyles,
  mergeSiteFooter,
  mergeSiteHeader,
  buildSiteDefaultMetadata,
  UI_COPY,
} from "@tylerlirette/pagebuilder";
import { VisualEditingControls } from "@tylerlirette/pagebuilder/preview";
import { SiteFooter, SiteHeader } from "@tylerlirette/pagebuilder/ui";
import {
  globalStylesQuery,
  siteFooterQuery,
  siteHeaderQuery,
} from "@tylerlirette/pagebuilder/next";
import { getSiteSettings, sanityFetch, SanityLive } from "@/sanity";
import "../globals.css";

// ISR fallback only. Freshness comes from the Live Content API (SanityLive) and the signed webhook.
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
    return mergeGlobalStyles(data as Parameters<typeof mergeGlobalStyles>[0]);
  } catch {
    return mergeGlobalStyles(null);
  }
}

async function getSiteHeader(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  try {
    const { data } = await sanityFetch({
      query: siteHeaderQuery,
    });
    return mergeSiteHeader(data as Parameters<typeof mergeSiteHeader>[0], settings);
  } catch {
    return mergeSiteHeader(null, settings);
  }
}

async function getSiteFooter(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  try {
    const { data } = await sanityFetch({
      query: siteFooterQuery,
    });
    return mergeSiteFooter(data as Parameters<typeof mergeSiteFooter>[0], settings);
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[length:var(--radius-button)] focus:bg-brand focus:px-4 focus:py-2 focus:text-[length:var(--text-body)] focus:font-semibold focus:text-on-brand"
        >
          {UI_COPY.skipToContent}
        </a>
        <SiteHeader config={siteHeader} />
        {children}
        <SiteFooter config={siteFooter} />
      </div>
      <SanityLive />
      <VisualEditingControls />
    </>
  );
}
