/**
 * Code-level fallbacks for site identity.
 * Prefer Site Settings in Sanity for day-to-day branding.
 */
export const siteConfig = {
  name: "Four Kings Racing",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  description: "Official home of Four Kings Racing.",
  openGraphDescription: "Official home of Four Kings Racing.",
  logos: {
    header: "/logo.svg",
    footer: "/logo.svg",
    headerAlt: "Four Kings Racing",
    footerAlt: "Four Kings Racing",
  },
  social: {
    instagram: "https://www.instagram.com/",
  },
  footer: {
    copyrightEntity: "Four Kings Racing",
    newsletterBlurb: "Sign up for schedule updates, partner news, and appearances.",
  },
  instagramWidget: {
    defaultIframeSrc: undefined as string | undefined,
  },
} as const;
