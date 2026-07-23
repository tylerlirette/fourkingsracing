import Link from "next/link";
import { headingVoice } from "@tylerlirette/pagebuilder";
import { getSiteSettings } from "@/sanity/lib/live";

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-subtle">404</p>
      <h1
        className={`mt-3 font-heading text-4xl ${headingVoice} tracking-tight text-foreground md:text-5xl`}
      >
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-[length:var(--text-body)] leading-relaxed text-muted">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-[length:var(--radius-button)] bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-secondary"
      >
        Back to {settings.name}
      </Link>
    </main>
  );
}
