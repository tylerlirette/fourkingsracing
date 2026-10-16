import { UI_COPY } from "@tylerlirette/pagebuilder";
import {
  createRateLimiter,
  getClientIp,
  getWriteClient,
  isFormConsentGiven,
  isHoneypotTriggered,
  isValidEmail,
  readFormBody,
} from "@tylerlirette/pagebuilder/next-api";
import { NextResponse } from "next/server";

const isRateLimited = createRateLimiter({ limit: 5, windowMs: 60_000 });

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ error: UI_COPY.forms.rateLimited }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await readFormBody(request);
  } catch {
    return NextResponse.json({ error: UI_COPY.forms.invalidBody }, { status: 400 });
  }

  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ ok: true });
  }

  if (!isFormConsentGiven(body.consent)) {
    return NextResponse.json({ error: UI_COPY.forms.consentRequired }, { status: 400 });
  }

  const email = text(body.email).toLowerCase();
  const source = text(body.source) || "footer";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: UI_COPY.forms.emailInvalid }, { status: 400 });
  }

  let client;
  try {
    client = getWriteClient();
  } catch {
    return NextResponse.json({ error: UI_COPY.forms.newsletter.notConfigured }, { status: 503 });
  }

  try {
    const existingLead = await client.fetch<string | null>(
      `*[_type == "newsletterLead" && email == $email][0]._id`,
      { email }
    );

    if (existingLead) {
      return NextResponse.json({ ok: true, message: UI_COPY.forms.newsletter.alreadySubscribed });
    }

    const submittedAt = new Date().toISOString();

    await client.create({
      _type: "newsletterLead",
      email,
      source,
      submittedAt,
      consent: true,
      consentAt: submittedAt,
      userAgent: request.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: UI_COPY.forms.newsletter.saveError }, { status: 500 });
  }
}
