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
    return NextResponse.json(
      { error: UI_COPY.forms.rateLimited },
      { status: 429 }
    );
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

  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone);
  const message = text(body.message);
  const source = text(body.source) || "contactForm";

  if (!name) {
    return NextResponse.json({ error: UI_COPY.forms.contact.nameRequired }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: UI_COPY.forms.emailInvalid }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: UI_COPY.forms.contact.messageRequired }, { status: 400 });
  }

  if (name.length > 200 || email.length > 320 || phone.length > 40 || message.length > 5000) {
    return NextResponse.json({ error: UI_COPY.forms.tooLong }, { status: 400 });
  }

  let client;
  try {
    client = getWriteClient();
  } catch {
    return NextResponse.json({ error: UI_COPY.forms.contact.notConfigured }, { status: 503 });
  }

  const submittedAt = new Date().toISOString();

  try {
    await client.create({
      _type: "contactSubmission",
      name,
      email,
      ...(phone ? { phone } : {}),
      message,
      source,
      submittedAt,
      consent: true,
      consentAt: submittedAt,
      userAgent: request.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: UI_COPY.forms.contact.fallbackError }, { status: 500 });
  }
}
