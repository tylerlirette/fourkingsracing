"use client";

import Link from "next/link";
import { useEffect } from "react";
import { headingVoice } from "@tylerlirette/pagebuilder";
import { siteConfig } from "@/lib/siteConfig";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SiteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-subtle">Error</p>
      <h1
        className={`mt-3 font-heading text-4xl ${headingVoice} tracking-tight text-foreground md:text-5xl`}
      >
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-[length:var(--text-body)] leading-relaxed text-muted">
        We couldn’t load this page right now. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-[length:var(--radius-button)] bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-secondary"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[length:var(--radius-button)] border border-border px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground transition hover:border-brand hover:text-brand"
        >
          {siteConfig.name} home
        </Link>
      </div>
    </main>
  );
}
