# Four Kings Racing

Next.js + Sanity site powered by the private [`@tylerlirette/pagebuilder`](https://github.com/tylerlirette/pagebuilder) kit.

Brand content lives here (`src/lib/siteConfig.ts`, `public/`, Sanity dataset). Kit updates:

```bash
npm update @tylerlirette/pagebuilder
```

Production installs the kit from GitHub (`github:tylerlirette/pagebuilder#main`). Vercel needs a `PAGEBUILDER_GIT_TOKEN` env var (fine-grained PAT with Contents: Read on the private `pagebuilder` repo). The install command rewrites git SSH URLs to authenticated HTTPS.

Local kit development can temporarily use `"@tylerlirette/pagebuilder": "file:../pagebuilder"` (keep the `pagebuilder` repo as a sibling folder), then switch back before deploy.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in Sanity + site URL values.

3. Run the app:

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

4. In Studio, publish **Site Settings**, **Global Styles**, **Site Header**, **Site Footer**, and a **Home Page** with slug `/`.

## Partner editing

Editors use Sanity Studio at `/studio` on the deployed site. Invite them in [Sanity project members](https://www.sanity.io/manage/project/rp6ge3c1/members) (Editor role is enough for content).
