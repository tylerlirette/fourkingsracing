import {
  slugFromPathSegments,
  staticParamsFromSlug,
  buildPageMetadata,
} from "@tylerlirette/pagebuilder";
import { PageSections } from "@tylerlirette/pagebuilder/ui";
import { allPageSlugsQuery } from "@tylerlirette/pagebuilder/next";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getSiteSettings, sanityFetch } from "@/sanity/lib/live";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  try {
    const { data: pages } = await sanityFetch({
      query: allPageSlugsQuery,
      perspective: "published",
      stega: false,
    });
    const rows = (pages || []) as { slug: string }[];
    const params = rows.map((page) => staticParamsFromSlug(page.slug));
    const hasHome = rows.some((page) => page.slug === "/");
    return hasHome ? params : [{}, ...params];
  } catch {
    return [{}];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = slugFromPathSegments(segments);
  const settings = await getSiteSettings();

  let page;
  try {
    page = await getPageBySlug(slug, false);
  } catch {
    return { title: "Unavailable" };
  }

  if (!page) {
    return { title: "Page not found" };
  }

  return buildPageMetadata({
    pageTitle: page.title,
    slug: page.slug,
    seo: page.seo,
    settings,
  });
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug: segments } = await params;
  const slug = slugFromPathSegments(segments);
  const [page, settings] = await Promise.all([getPageBySlug(slug), getSiteSettings()]);

  if (!page) {
    notFound();
  }

  return (
    <main className="flex-1">
      <PageSections
        page={page}
        instagramWidgetSrc={settings.instagramWidget.defaultIframeSrc}
      />
    </main>
  );
}
