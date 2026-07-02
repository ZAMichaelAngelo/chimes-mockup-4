# Specialised Solutions Page + Nav Hover Previews — Design

## Context

v4 is the current focus mockup (dark navy/lime "Bulkshift-inspired" theme). A separate mockup, v6, has a lighter Apple-inspired glass/aurora theme and includes a "Tailored Solutions" page — six industry cards (Construction, Mining, Petrochemical, Telecoms, Renewables, General Industrial) with a hero and CTA band.

This spec ports that page's content into v4, renamed and restyled, and adds an Apple-style nav hover-preview system plus an animated underline highlight.

## 1. Nav changes (all pages)

New tab order, applied identically on every page's header markup (index.html, fleet.html, galleries.html, contact.html, privacy.html, tailored-solutions.html):

```
Home → Fleet & Specs → Specialised Solutions → Galleries → Who We Are → Contact
```

"Specialised Solutions" uses British spelling to match the rest of the site's copy (e.g. "specialised transport" already appears sitewide).

## 2. New page: `tailored-solutions.html`

Ported from v6's `tailored-solutions.html` but rebuilt with v4's existing solid-card visual language instead of v6's frosted-glass/aurora look (v4 has no `.glass`/`.aurora` system):

- **Hero**: reuse v4's `.page-hero-v4` pattern (same as fleet.html/galleries.html), background image = petrochemical shot copied from v6.
- **Industry grid**: 6 cards (Construction, Mining, Petrochemical, Telecoms, Renewables, General Industrial), each with an image + heading + short copy (copy reused verbatim from v6). Styled like v4's existing `.team-card`/`.fc` pattern: `var(--card)` background, `1px solid var(--line)` border, no blur/glass, hover = lift (`translateY`) + border turns `var(--green)`.
- Each card gets a stable `id` (`construction`, `mining`, `petrochemical`, `telecoms`, `renewables`, `industrial`) so the nav dropdown (below) can deep-link into the page.
- **CTA band**: reuse v4's existing `.cta-v4` styling ("Tell Us The Job. We'll Tailor The Lift." → Get A Quote → `contact.html#quote`).
- Images: the 6 source files (`construction.jpg`, `mining.jpg`, `petrochemical.webp`, `telecoms.jpg`, `renewables.jpg`, `industrial.webp`) are copied from `chimes-mockup-v6/images/tailored/` into `chimes-mockup-v4/images/tailored/`.
- Nav/footer on this new page follow v4's standard header/footer markup (with the new nav order from section 1).

## 3. Nav hover preview

Each `<a>` in `.nav-links` is wrapped in a `.nav-item` container (`position:relative`) holding the link plus a `.nav-preview` panel, shown via pure CSS `:hover` (no JS — so on touch devices the preview simply never shows and tapping navigates directly, no broken interaction).

**Rich panel — Specialised Solutions only** (`.nav-preview.rich`):
2×3 grid of small thumbnails (industry image + name), each linking to `tailored-solutions.html#<id>`.

**Simple panel — all other tabs** (`.nav-preview.simple`):
One thumbnail + one-line tagline, linking to that tab's page. Content/images, reusing existing on-site assets (no new images needed beyond the tailored ones above):

| Tab | Image | Tagline |
|---|---|---|
| Home | `Cinematic Images/BARLOW pic #1.jpg` | "We Lift. South Africa Builds." |
| Fleet & Specs | `Cinematic Images/crane LBBD #1.jpg` | "8 to 400 Ton Tadano Fleet, Fully Specced." |
| Galleries | `images/gallery/onsite-lbbd3.jpg` | "See The Fleet On Site." |
| Who We Are | `images/the_team.webp` | "Owner-Managed. Hands-On Since 2003." |
| Contact | `images/office1.webp` | "Call, WhatsApp, Or Request A Quote." |

**Interaction**: panel is `opacity:0; pointer-events:none; transform:translateY(6px)` by default, transitions to `opacity:1; pointer-events:auto; transform:translateY(0)` on `.nav-item:hover .nav-preview`. Positioned `absolute`, anchored below its `.nav-item`.

## 4. Animated green underline

Current behaviour: `.nav-links a.active::after` shows a static full-width green bar; nothing happens on hover.

New behaviour: `.nav-links a::after` always exists with `width:0`, `transition:width .25s ease`. Both `.active` and `:hover` set `width:100%`, so every tab now animates the underline in on hover (and the active tab keeps its permanent underline, unaffected visually since it's already full width).

## Files touched

- `index.html`, `fleet.html`, `galleries.html`, `contact.html`, `privacy.html` — nav markup (add tab, wrap items, add preview panels)
- `tailored-solutions.html` — new file
- `style.css` — `.tlr-*` card styles (v4-flavoured), `.nav-item`/`.nav-preview` system, updated underline rule
- `images/tailored/*` — 6 images copied from v6

## Out of scope

- No JS-driven interaction (CSS-only hover)
- No changes to v6 (source only, untouched)
- No new photography — all preview thumbnails reuse existing on-site images
