import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
/** In-memory limiter — best-effort per server instance. For stronger limits in production, use edge middleware or a shared store (e.g. Upstash). */
const rateLimitStore = new Map<string, number[]>();

type SignupBody = {
  email?: string;
  source?: string;
  company?: string;
};

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    return firstIp?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recentRequests = (rateLimitStore.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return false;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const source = body.source?.trim() || "footer";
  const company = body.company?.trim() ?? "";

  // Honeypot field: real users should not fill this.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-28";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    return NextResponse.json({ error: "Signup service is not configured yet." }, { status: 503 });
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  try {
    const existingLead = await client.fetch<string | null>(
      `*[_type == "newsletterLead" && email == $email][0]._id`,
      { email }
    );

    if (existingLead) {
      return NextResponse.json({ ok: true, message: "You're already on the updates list." });
    }

    await client.create({
      _type: "newsletterLead",
      email,
      source,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save signup. Please try again." }, { status: 500 });
  }
}
