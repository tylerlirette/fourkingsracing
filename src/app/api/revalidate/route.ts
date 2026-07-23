import { pathFromSlug } from "@tylerlirette/pagebuilder";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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

function getSecret(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  const url = new URL(request.url);
  return url.searchParams.get("secret");
}

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
  const path = pathFromSlug(slug);
  revalidatePath(path);
  revalidatePath("/sitemap.xml");
}

export async function POST(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      { error: "Revalidation is not configured (missing SANITY_REVALIDATE_SECRET)." },
      { status: 503 }
    );
  }

  const provided = getSecret(request);
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    const text = await request.text();
    if (text.trim()) {
      body = JSON.parse(text) as RevalidateBody;
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

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
    revalidated.push(pathFromSlug(slug), "/sitemap.xml");
  } else if (body._type === "newsletterLead") {
    return NextResponse.json({ revalidated: false, skipped: "newsletterLead" });
  } else {
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  }

  return NextResponse.json({ revalidated: true, paths: revalidated, now: Date.now() });
}

export async function GET(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();
  const provided = getSecret(request);

  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  revalidateSiteChrome();
  return NextResponse.json({
    revalidated: true,
    paths: ["/", "layout", "/sitemap.xml"],
    now: Date.now(),
  });
}
