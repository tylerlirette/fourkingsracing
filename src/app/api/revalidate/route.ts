import { pageSlugToPath } from "@tylerlirette/pagebuilder";
import { parseBody } from "next-sanity/webhook";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const GLOBAL_DOC_TYPES = new Set([
  "siteSettings",
  "globalStyles",
  "siteHeader",
  "siteFooter",
]);

type RevalidateBody = {
  _type?: string;
  slug?: string;
  path?: string;
};

function normalizeSlug(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed === "/") {
    return "/";
  }
  return trimmed.replace(/^\/+|\/+$/g, "");
}

function revalidateSiteChrome() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
}

function revalidatePagePath(slug: string) {
  const path = pageSlugToPath(slug);
  revalidatePath(path);
  revalidatePath("/sitemap.xml");
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation is not configured (missing SANITY_REVALIDATE_SECRET)." },
      { status: 503 }
    );
  }

  // next-sanity/webhook parseBody checks sanity-webhook-signature via @sanity/webhook.
  let parsed: { isValidSignature: boolean | null; body: RevalidateBody | null };
  try {
    parsed = await parseBody<RevalidateBody>(request, secret);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!parsed.isValidSignature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const body = parsed.body ?? {};
  const explicitPath = typeof body.path === "string" ? body.path.trim() : "";
  const revalidated: string[] = [];

  if (explicitPath === "all" || explicitPath === "*") {
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  } else if (explicitPath) {
    revalidatePath(explicitPath);
    revalidated.push(explicitPath);
  } else if (body._type && GLOBAL_DOC_TYPES.has(body._type)) {
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  } else if (body._type === "page") {
    const slug = normalizeSlug(body.slug) || "/";
    revalidatePagePath(slug);
    revalidated.push(pageSlugToPath(slug), "/sitemap.xml");
  } else if (body._type === "newsletterLead") {
    return NextResponse.json({ revalidated: false, skipped: "newsletterLead" });
  } else {
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  }

  return NextResponse.json({ revalidated: true, paths: revalidated, now: Date.now() });
}
