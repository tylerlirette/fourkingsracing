// Fails fast on missing environment variables before a deploy or a Studio session.
// Run with: npm run check-env (reads .env.local when present).

const required = [
  ["NEXT_PUBLIC_SANITY_PROJECT_ID", "Sanity project ID"],
  ["NEXT_PUBLIC_SANITY_DATASET", "Sanity dataset name"],
  ["SANITY_API_READ_TOKEN", "Viewer token for draft preview and Presentation"],
  ["SANITY_API_WRITE_TOKEN", "Editor token for the contact and newsletter forms"],
  ["SANITY_REVALIDATE_SECRET", "Signing secret for the Sanity webhook"],
];

const recommended = [
  ["NEXT_PUBLIC_SITE_URL", "Canonical origin. Required in production so canonical URLs are correct."],
];

const missing = required.filter(([key]) => !process.env[key]?.trim());
const unset = recommended.filter(([key]) => !process.env[key]?.trim());

for (const [key, purpose] of unset) {
  console.warn(`warning: ${key} is not set (${purpose})`);
}

if (missing.length) {
  console.error("Missing required environment variables:");
  for (const [key, purpose] of missing) {
    console.error(`  - ${key}: ${purpose}`);
  }
  console.error("Copy .env.example to .env.local and fill in the values.");
  process.exit(1);
}

console.log("All required environment variables are set.");
