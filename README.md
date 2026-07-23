# Four Kings Racing

Next.js + Sanity site powered by the private [`@tylerlirette/pagebuilder`](https://github.com/tylerlirette/pagebuilder) kit.

Brand content lives here (`src/lib/siteConfig.ts`, `public/`, Sanity dataset). Kit updates:

```bash
npm update @tylerlirette/pagebuilder
```

Local kit development uses `"@tylerlirette/pagebuilder": "file:../pagebuilder"` (keep the `pagebuilder` repo as a sibling folder).

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
