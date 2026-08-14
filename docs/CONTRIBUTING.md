# Contributing to Corag

> The public-facing version of this document is content, at
> [`src/content/pages/{es,en}/contributing.md`](../src/content/pages/es/contributing.md),
> rendered as `/contributing`. **That file is the one people read.** This one is
> for whoever is about to open a pull request.

## First, the highest-impact path is not this repository

If you want to help, publishing another aid application is usually the wrong
move. During an emergency several teams start building at once, each with its
own database of needs, and the result is more fragmentation rather than less.

> **Many interfaces, one network of data.**

Corag publishes its network so a new application becomes a client of the same
data instead of a competing copy. Things worth building on top of it are listed
on [`/developers`](https://corag.app/developers).

## Working on this site

```bash
pnpm install
pnpm run dev          # http://localhost:9999
```

Before opening a pull request, every one of these must pass:

```bash
pnpm run biome:check          # lint + format (never ESLint or Prettier)
pnpm run astro:check          # types
pnpm run test                 # unit tests
pnpm run build                # production build
pnpm run md:check:strict      # every page has a complete .md twin
pnpm run lang:check:strict    # Spanish at /, English at /en
pnpm run seo:check:strict     # metadata and structured data
pnpm run parity:check:strict  # both languages carry the same content
pnpm run redirects:check:strict # no redirect breaks a live page
```

The last five are not decoration. `parity:check` exists because a Spanish body
can gain a paragraph its English sibling never gets while every other check
stays green — which is how a previous version of this site ended up with 88 of
94 pairs drifted. `redirects:check` exists because a rule can 301 a live page
away from itself into a 404, and nothing else in the toolchain notices.

## Conventions that matter

- **Code, comments and documentation in English.** Public content is Spanish
  first, with a real English translation — not the Spanish with words swapped.
- **Accents and ñ are not optional** in Spanish content. `AGENTS.md` carries the
  grep commands that catch the common misses.
- **Slugs are English in both languages**, including blog posts and routes.
- **New top-level routes must be added to `src/middleware.ts`.** A route missing
  from the allowlist works in dev and 404s in production.
- **Design tokens get used, not replaced with hex values.** See
  [Design System](./DESIGN.md).
- **No placeholder text.** `[TODO:]`, `[TBD]`, Lorem ipsum — zero tolerance.

## Content

- **Blog posts** must go through the `/add-blog-post` skill. Both languages,
  same English slug, same author slug, max five tags.
- **Tags are never created without user approval.** Propose with
  `/audit-taxonomy`.
- **Page copy changes must update the `.md` twin** under
  `src/content/pages/{es,en}/`. The `md:check` gate enforces completeness, not
  existence — a summary fails.

## Design

Still open, and genuinely needed:

- A **vector master of the logo**. It exists only as raster today, and the
  favicon wraps a bitmap.
- Illustration and diagrams that explain the model without resorting to
  photography of suffering.
- Accessibility review against real screens, beyond the measured contrast ratios
  already documented.

## Related

- [Standards](./STANDARDS.md) · [Testing](./TESTING_GUIDE.md) · [Architecture](./ARCHITECTURE.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md) — applies to issues, pull requests and reviews
