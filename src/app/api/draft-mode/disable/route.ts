import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await draftMode()).disable();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin;
  return NextResponse.redirect(new URL("/", siteUrl));
}
