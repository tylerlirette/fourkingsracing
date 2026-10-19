import Link from "next/link";
import { headingVoice, UI_COPY } from "@tylerlirette/pagebuilder";
import { getSiteSettings } from "@/sanity";

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <main id="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-[length:var(--text-body)] font-semibold uppercase tracking-widest text-subtle">{UI_COPY.notFoundEyebrow}</p>
      <h1
        className={`mt-3 font-heading text-[length:var(--text-heading-page-md)] ${headingVoice} tracking-tight text-foreground md:text-[length:var(--text-hero-heading-md)]`}
      >
        {UI_COPY.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-md text-[length:var(--text-body)] leading-relaxed text-muted">
        {UI_COPY.notFoundBody}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-[length:var(--radius-button)] bg-brand px-5 py-2.5 text-[length:var(--text-body)] font-bold uppercase tracking-wide text-on-brand transition hover:bg-brand-secondary"
      >
        {UI_COPY.notFoundHomeLink(settings.name)}
      </Link>
    </main>
  );
}
