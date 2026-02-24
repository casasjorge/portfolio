# Jorge Casas Portfolio

Personal portfolio for astrophysics, propulsion, and engineering work.

The site is a content-first Next.js application (App Router) that statically exports to GitHub Pages. Projects are authored in MDX, writing entries are managed in JSON, and the UI layers animation, filtering, and media-heavy project storytelling on top of those content sources.

## Objective

- Showcase technical projects as polished case studies.
- Publish writing/research entries with downloadable PDFs and related-project links.
- Keep content authoring local (MDX/JSON) without an external CMS.
- Deploy as a fast static site with SEO metadata and pre-rendered routes.

## Architecture Summary

### Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + custom global CSS tokens
- Framer Motion for page/section transitions
- MDX (`@next/mdx`) with `remark-math` + `rehype-katex`
- `next-themes` for light/dark theme switching

### Rendering Model (Server + Client split)

Server route modules load typed content and metadata, then pass data into client components for interaction-heavy UI.

Examples:

- `src/app/page.tsx` -> `src/app/HomeClient.tsx`
- `src/app/projects/page.tsx` -> `src/app/projects/client.tsx`
- `src/app/projects/[slug]/page.tsx` -> `src/app/projects/[slug]/client.tsx`
- `src/app/projects/[slug]/[subpage]/page.tsx` -> `src/app/projects/[slug]/[subpage]/client.tsx`
- `src/app/writing/page.tsx` -> `src/app/writing/client.tsx`

### Content Pipeline

#### Projects (`src/lib/projects.ts`)

`src/lib/projects.ts` is the core content loader. It:

- discovers project folders under `src/content/projects/`
- imports MDX modules dynamically (`index.mdx` or `content.mdx`)
- reads raw MDX source from disk to parse narrative sections from the body
- normalizes metadata into a typed `Project` shape
- discovers and loads optional subpages from `subpages/*.mdx`
- caches loaded project/subpage data and MDX components in memory
- filters drafts by `INCLUDE_DRAFT_PROJECTS`
- applies centralized display overrides (`featured`, `order`) from `src/content/project-display.ts`
- assigns deterministic, distinct accent colors when not explicitly set

The parser supports a hybrid authoring model:

- `export const project = { ... }` provides structured metadata
- MDX body prose becomes the project overview
- `##` headings become narrative sections
- `**Insight:** ...` becomes the highlighted section insight
- markdown image lines (and standalone YouTube links) become media items
- italic lines following media become captions

If no parsed sections exist, the route falls back to rendering the MDX body directly.

#### Writing (`src/lib/writing.ts`)

Writing entries are defined in `src/content/writing.json` and loaded as typed records. The loader:

- sorts entries by parsed date (year/month/day supported)
- uses status as a secondary sort within the same year
- supports `relatedProjects` links by project slug

## Routes and URL Structure

### Top-level routes

- `/` Home (hero, about, featured projects, contact CTA)
- `/projects/` Project index with canonical tag filters
- `/writing/` Writing/research list

### Dynamic project routes

- `/projects/[slug]/` Main project detail page
- `/projects/[slug]/[subpage]/` Optional subpage (multi-phase or subsystem deep-dives)

Static generation is implemented with `generateStaticParams()` for both project and subpage routes.

## Directory Guide (Source of Truth)

```text
src/
  app/                  Next.js App Router routes, layouts, loading states
  components/           Reusable UI, project/storytelling blocks, nav/footer, MDX renderers
  content/
    projects/           MDX project content (one folder per project)
    writing.json        Writing/research metadata list
    project-display.ts  Central featured/order controls for project cards
  lib/                  Content loaders, filters, SEO, media helpers, UI tokens
public/
  projects/             Project assets (images, videos, PDFs)
  writing/              Published writing PDFs
  heroes/               Home/projects/writing hero media assets
  about/                Resume/CV/about assets
.github/workflows/      GitHub Pages deploy workflow
```

Repository note:

- The app reads from the canonical `src/` and `public/` trees.
- There are duplicate/legacy-looking paths in this repo (for example `src/src`, `public/public`, `public/projects/projects`). Treat them as non-canonical unless you intentionally wire them in.

## Content Authoring

### Projects (MDX)

Each project lives in:

```text
src/content/projects/<slug>/index.mdx
```

Assets should live in:

```text
public/projects/<slug>/
```

Minimal project MDX shape:

```mdx
export const project = {
  title: "Project Title",
  shortDescription: "Optional card summary",
  tags: ["astrophysics", "numerical-simulation"],
  heroImage: "/projects/my-project/hero.jpg",
  gallery: ["/projects/my-project/detail-1.jpg"],
  technologies: ["Python", "NumPy"],
  links: {
    github: "https://github.com/user/repo",
    paper: ""
  },
  dates: { start: "2025-01", end: "Present" },
  draft: false
}

Overview paragraph(s) here.

## Section Title
**Insight:** Key takeaway line

Section body text.

![Figure](/projects/my-project/figure.png)
*Optional caption*
```

For the full authoring guide and parsing rules, see `src/content/projects/README.md`.

### Optional project subpages

Add files under:

```text
src/content/projects/<slug>/subpages/*.mdx
```

Each subpage exports `meta` and can include its own body narrative and `##` sections.

### Writing entries

Add metadata to `src/content/writing.json` and place the corresponding PDF or file in `public/writing/<writing-slug>/` (or another referenced `public/` path).

Minimal example:

```json
{
  "id": "my-writing-id",
  "slug": "my-writing-slug",
  "title": "My Writing Title",
  "type": "research",
  "abstract": "Summary text.",
  "date": "2026",
  "tags": ["astrophysics"],
  "status": "published",
  "relatedProjects": ["my-project"],
  "links": {
    "pdf": "/writing/my-writing-slug/paper.pdf"
  }
}
```

### Draft project visibility

Draft projects are hidden by default.

- Set `INCLUDE_DRAFT_PROJECTS=true` to include drafts locally.
- Set `INCLUDE_DRAFT_PROJECTS=false` to force-hide drafts.

## Project Filtering and Display Controls

### Canonical filters (Projects page)

The Projects page shows a curated filter taxonomy instead of every raw tag.

- Canonical filter definitions: `src/lib/canonicalTags.ts`
- Filter behavior hook: `src/lib/useProjectTagFilters.ts`
- Filter UI: `src/components/ProjectFilters.tsx`

If you add a new raw tag and want it to appear in the Projects page filters, map it in `src/lib/canonicalTags.ts`.

### Featured/order overrides

Project card ordering and featured status are centrally controlled in `src/content/project-display.ts`.

This lets you reorder cards or change featured selections without editing each project MDX file.

## Styling, Theme, and UX

### Global styling

- Global CSS and design tokens: `src/app/globals.css`
- Tailwind theme extensions: `tailwind.config.js`
- Shared UI class tokens: `src/lib/ui.ts`
- Layout primitives: `src/components/LayoutPrimitives.tsx`

### Theme

- Theme provider: `src/components/ThemeProvider.tsx`
- Theme toggle (used in nav/footer shell areas): `src/components/ThemeToggle.tsx`
- `next-themes` is configured for explicit dark/light toggle (`enableSystem={false}`).

### Motion and page transitions

- Route enter animation: `src/app/template.tsx`
- Shared animation variants/timings: `src/lib/animations.ts`
- Many major sections/components use Framer Motion wrappers (`AnimatedSection`, project grids/cards, etc.)

## MDX Rendering and Rich Content

- Root MDX component hook: `mdx-components.tsx`
- Styled MDX element mapping: `src/components/mdx/MDXComponents.tsx`
- Math rendering: `remark-math` + `rehype-katex` (`katex` CSS imported in `src/app/layout.tsx`)

The MDX renderer includes styled headings, lists, tables, code blocks, links, and images, plus a helper to render some transparent images against white backgrounds.

## Performance and SEO

### Performance helpers

- Route candidate precompute from project folders: `src/lib/preloadManifest.ts`
- Client-side route prefetching based on network conditions and hover intent: `src/components/ContentPreloader.tsx`
- Browser `speculationrules` prefetch hints: `src/components/SpeculationRules.tsx`
- Route loading skeletons: `src/app/projects/loading.tsx`, `src/app/writing/loading.tsx`

### SEO and metadata

- Site-level metadata: `src/app/layout.tsx`
- Project metadata generation: `src/app/projects/[slug]/page.tsx`
- Project subpage metadata + canonical URLs: `src/app/projects/[slug]/[subpage]/page.tsx`
- URL helper: `src/lib/seo.ts`

## Local Development

### Requirements

- Node.js 18+ (GitHub Actions workflow uses Node 18)
- npm

### Commands

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Other common commands:

```bash
npm run build
npm run start
npm run lint
```

## Build and Deployment

This repo is configured for GitHub Pages static hosting.

Key details:

- Production builds use `output: 'export'` in `next.config.js`
- `trailingSlash: true` is enabled
- Next image optimization is disabled (`images.unoptimized: true`) for static export compatibility
- GitHub Actions workflow builds and deploys `./out` via Pages (`.github/workflows/deploy.yml`)
- Custom domain is defined in `CNAME`

## Common Maintenance Tasks

### Add a project

1. Create `src/content/projects/<slug>/index.mdx`
2. Add assets under `public/projects/<slug>/`
3. Add or update display ordering/featured state in `src/content/project-display.ts`
4. Map new tags in `src/lib/canonicalTags.ts` if needed for filter visibility

### Add project subpages

1. Create `src/content/projects/<slug>/subpages/<subpage-slug>.mdx`
2. Export `meta` with `title` and `order`
3. Add any assets under `public/projects/<slug>/...`

### Add a writing entry

1. Place the file under `public/writing/<slug>/` (or another `public/` path you reference)
2. Add an entry to `src/content/writing.json`
3. Link related projects using `relatedProjects` slugs when applicable

### Update site identity/contact/media

- Site URL, nav items, social links, contact email, resume/CV paths, and main-tab hero media: `src/lib/site.ts`
- Home page copy and featured sections: `src/app/HomeClient.tsx`
- Navigation/footer UI: `src/components/Navigation.tsx`, `src/components/Footer.tsx`

## Notes for Contributors

- The repository may contain local maintenance utilities or migration artifacts that are not part of the production site path.
- When in doubt, treat `src/app`, `src/components`, `src/content`, `src/lib`, and `public` as the canonical website surface.

## Security Checklist

Use this as a lightweight operational checklist for a public, static portfolio deployment.

- Keep 2FA enabled on GitHub, Cloudflare, and your domain registrar.
- Keep `CNAME` and `src/lib/site.ts` aligned to the same canonical domain.
- Do not commit secrets; rotate any secret immediately if it is ever committed (including history).
- Keep generated build output (`out/`) untracked in git.
- Strip metadata from public assets before publishing (EXIF in photos, document metadata in PDFs).
- Pin GitHub Actions to commit SHAs and review/update pins periodically.
- Enable GitHub Dependabot alerts/security updates and keep dependencies current.
- Protect the default branch (reviews, no force-pushes).
- If you later proxy traffic through Cloudflare, add security headers there (CSP, `nosniff`, referrer policy, permissions policy).
- Optional but recommended: enable DNSSEC and add CAA DNS records.
