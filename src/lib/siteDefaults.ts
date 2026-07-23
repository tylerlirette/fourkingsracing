import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@tylerlirette/pagebuilder";
import { siteConfig } from "@/lib/siteConfig";

/** Brand defaults passed into pagebuilder merge helpers. */
export const siteDefaults: SiteSettings = {
  ...DEFAULT_SITE_SETTINGS,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  openGraphDescription: siteConfig.openGraphDescription,
  logos: { ...siteConfig.logos },
  social: { ...siteConfig.social },
  footer: { ...siteConfig.footer },
  instagramWidget: {
    defaultIframeSrc: siteConfig.instagramWidget.defaultIframeSrc,
  },
};
