# Fleet Page Card Redesign (ported from v3) — Design

## Context

v4's `fleet.html` fleet catalog currently uses `.fleet-card-grid`/`.fc` — tall (4:5 aspect ratio), full-bleed image tiles with just a green name/class overlay at the bottom. No description, no explicit "view specs" affordance beyond the whole tile being clickable.

v3's fleet catalog (`.fleet-grid`/`.fl-card`) uses a shorter 190px image crop, a small green capacity-class badge floating on the image, and a proper white card body underneath with a title, a green model/capacity caption line, a short description, and a "View Specs →" link. The user finds this format better — more like a real spec catalog — and wants it on v4, reskinned to v4's dark navy/lime palette instead of v3's light/navy one.

`.fc`/`.fleet-card-grid` are also used by `index.html`'s homepage "Our Fleet" teaser (4 flagship cards, no description/link in that markup). To avoid breaking the homepage teaser, this redesign introduces new, fleet-page-scoped classes rather than restyling the shared `.fc` classes.

## 1. New card component (fleet.html only)

New classes (names borrowed from v3, since they're not already used in v4 CSS): `.fleet-grid`, `.fl-card`, `.fl-img`, `.fl-tag`, `.fl-body`, `.fl-cap`.

- **`.fleet-grid`**: `display:grid; grid-template-columns:repeat(4,1fr); gap:20px;` — same 4-column layout as today's `.fleet-card-grid`, gap tightened from 18px to 20px to match v3.
- **`.fl-card`**: a `<button>` (same click-to-open-modal pattern as today's `.fc`), `background:var(--card); border:1px solid var(--line);` (v4's existing solid-card pattern, same family as `.tlr-card`/`.team-card`). On hover: `transform:translateY(-4px); border-color:var(--green);` — v4's established hover treatment (matches `.tlr-card:hover`), replacing v3's white-card drop-shadow.
- **`.fl-img`**: `height:190px; background-size:cover; background-position:center; position:relative;` — same fixed height as v3 (vs. today's tall 4:5 crop). A bottom-anchored gradient scrim (`linear-gradient(to top, rgba(6,12,18,.75) 0%, transparent 55%)`, using v4's dark bg tone in place of v3's navy tone) keeps the tag badge legible over bright photo areas.
- **`.fl-tag`**: green capacity-class badge floating bottom-left of the image — `background:var(--green); color:var(--navy-ink);` (v4's on-green text color, same as `.btn-sub`/`.wa-cta`), small uppercase label (e.g. "Truck Mount", "All Terrain").
- **`.fl-body`**: `padding:18px 20px 22px;` containing:
  - `h3` — crane name, `color:var(--white)`, `font-family:var(--ff-head)`.
  - `.fl-cap` — model/capacity caption (e.g. "Tadano ATF 40G-2"), `color:var(--green)`, uppercase, small.
  - `p` — one-line description (reused verbatim from v3's copy — same 8 descriptions already exist there), `color:var(--text)`.
  - "View Specs →" link using v4's existing `.hl` link style (green text, same treatment as the "get in touch" link already on this page), with a `→` arrow.

## 2. Section headings

Replace the two `.cap-hd`-based group headers ("01 / Small Cranes", "02 / Big Cranes") with a new `.fleet-group-hd` component scoped to this page only (does not touch the shared `.cap-hd` class used elsewhere sitewide):

- `.fleet-group-hd`: `display:flex; align-items:baseline; gap:16px; margin:64px 0 28px;`
- `.fleet-group-hd h3`: `font-family:var(--ff-head); font-size:22px; font-weight:800; color:var(--white);`
- `.fleet-group-hd hr`: `flex:1; border:none; border-top:1px solid var(--line);` — the line that stretches to the right, using v4's line color instead of v3's `--grey`.

## 3. Unchanged

- Homepage (`index.html`) "Our Fleet" teaser: untouched, keeps today's `.fc`/`.fleet-card-grid` tile style.
- Modals: v4's existing spec-table modals (already richer than v3's, with more spec rows) are untouched — only the pre-click catalog cards change.
- Bottom CTA band (`.cta-v4`): stays as v4's current flat design. v3's full photo-background CTA band is explicitly out of scope for this change.
- Responsive behavior: `.fleet-grid` gets the same breakpoint collapse pattern already used for `.fleet-card-grid`/`.tlr-grid` (2 columns at ≤980px, unchanged at ≤640px).

## Files touched

- `style.css` — new `.fleet-grid`/`.fl-card`/`.fl-img`/`.fl-tag`/`.fl-body`/`.fl-cap`/`.fleet-group-hd` rules, plus responsive additions.
- `fleet.html` — Small Cranes / Big Cranes catalog markup switches from `.fleet-card-grid`/`.fc` to the new classes; group headers switch from `.cap-hd` to `.fleet-group-hd`. Description copy for each of the 8 cranes is reused verbatim from v3's `fleet.html`.

## 4. Modal: match v3's layout (wide banner image, not side-by-side)

Superseded an earlier, incorrect read of this requirement (see git history) — the user does not want the image-left/specs-right split v4 had. They want v3's actual modal structure: a single column, with a full-width wide/landscape banner image across the top (v3's `.modal-img{height:260px}`) and the spec content below it — reskinned dark to match v4.

Implemented directly (not deferred to the plan below, since it's a small, self-contained CSS change already verified working): `.modal-card` dropped its `grid-template-columns:1fr 1fr`, `.modal-img` changed from `min-height:280px` (right-column fill) to a fixed `height:260px` full-width banner with a bottom-fade gradient scrim (`rgba(6,12,18,.65)` in place of v3's navy tone), and `.modal-tag` moved from top-left to bottom-left of the image to match v3's badge placement. The now-unnecessary responsive override that used to collapse the two-column grid to one column below a breakpoint was removed, since the modal is single-column at every width now, same as v3.

## Out of scope

- No changes to `index.html`, modals' spec-table content, or the CTA band.
- No changes to `chimes-mockup-v3` (source reference only).
- No new images — same `images/fleet/chimes-*.jpg` files already used by both v3 and v4.
- Image crop behavior (`background-size:cover` on `.modal-img`) is unchanged — user confirmed the issue is the stacking breakpoint, not cropping.
