# Fleet Page Card Redesign (ported from v3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fleet.html's tall, tightly-cropped image tiles with v3's shorter, more-zoomed-out card format (image + title + model caption + description + "View Specs" link), reskinned to v4's dark palette, without touching the shared classes the homepage teaser still depends on.

**Architecture:** Static HTML/CSS site, no build step, no JS framework, no test runner. New CSS classes scoped to this page's catalog only; markup in `fleet.html` swaps from the shared `.fleet-card-grid`/`.fc` classes to the new ones. `index.html`'s homepage teaser keeps using `.fleet-card-grid`/`.fc` untouched.

**Tech Stack:** HTML5, vanilla CSS (custom properties already defined in `:root`), no JS added.

## Global Constraints

- New classes only: `.fleet-grid`, `.fl-card`, `.fl-img`, `.fl-tag`, `.fl-body`, `.fl-cap`, `.fleet-group-hd` — never modify `.fleet-card-grid`, `.fc`, `.fc-img`, `.fc-tag`, `.fc-sub`, `.fc-class`, `.fc-name`, or `.cap-hd` (all shared with `index.html` / other pages).
- Card images use real `<img>` elements with `object-fit:cover` (matching v4's existing `.fc-img` pattern, per the codebase's own prior "real img elements" improvement) — not v3's CSS `background-image` div technique. This is a implementation-technique deviation from the literal spec text but produces the same visual result (190px-tall cropped photo, bottom gradient, tag badge); flag to the user after implementation in case they'd rather match v3's technique exactly.
- Image crop height: `190px` (matches v3, replacing today's `aspect-ratio:4/5` tall crop).
- Grid: 4 columns desktop, gap `20px` (matches v3, was `18px`).
- Colors: `background:var(--card); border:1px solid var(--line);` cards, `color:var(--white)` titles, `color:var(--green)` captions/badges, `color:var(--text)` body copy, `color:var(--navy-ink)` text-on-green (badge). Hover: `transform:translateY(-4px); border-color:var(--green);` (matches `.tlr-card:hover`, replacing v3's box-shadow).
- Description copy for all 8 cranes is reused verbatim from `chimes-mockup-v3/fleet.html` (quoted in Task 2 below) — do not paraphrase.
- `onclick="openModal('m-...')"` IDs are unchanged — same 8 modal IDs already in `fleet.html`, already fixed in a prior session (do not touch the modals themselves).

---

### Task 1: Add the new CSS classes to `style.css`

**Files:**
- Modify: `style.css` (two insertions — new rule block, and two responsive-query additions)

**Interfaces:**
- Consumes: `--card`, `--line`, `--green`, `--white`, `--text`, `--navy-ink`, `--ff-head` custom properties already defined in `:root`.
- Produces: `.fleet-grid`, `.fl-card`, `.fl-img`, `.fl-img img`, `.fl-tag`, `.fl-body`, `.fl-body h3`, `.fl-cap`, `.fl-body p`, `.fleet-group-hd`, `.fleet-group-hd h3`, `.fleet-group-hd hr` — Task 2's markup depends on these exact class names.

- [ ] **Step 1: Insert the new rule block after the Specialised Solutions page's `.tlr-body p` rule**

In `style.css`, find:

```css
.tlr-body p{font-size:14px; color:var(--text);}

/* ===== FORM / TEAM / CONTACT ===== */
```

Replace with:

```css
.tlr-body p{font-size:14px; color:var(--text);}

/* ===== FLEET CATALOG CARDS (v3-style, fleet.html only) ===== */
.fleet-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:20px;}
.fl-card{
  background:var(--card); border:1px solid var(--line);
  overflow:hidden; display:block; width:100%; padding:0; margin:0;
  text-align:left; font:inherit; color:inherit; cursor:pointer;
  transition:transform .25s ease, border-color .25s ease;
}
.fl-card:hover{transform:translateY(-4px); border-color:var(--green);}
.fl-img{height:190px; position:relative; overflow:hidden;}
.fl-img img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; display:block;}
.fl-img::after{content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(6,12,18,.7) 0%, transparent 55%); pointer-events:none;}
.fl-tag{
  position:absolute; bottom:10px; left:10px; z-index:1;
  background:var(--green); color:var(--navy-ink);
  font-family:var(--ff-head); font-size:10px; font-weight:800;
  letter-spacing:.08em; text-transform:uppercase; padding:4px 9px;
}
.fl-body{padding:18px 20px 22px;}
.fl-body h3{font-family:var(--ff-head); font-size:16px; font-weight:800; color:var(--white); margin-bottom:3px;}
.fl-cap{font-family:var(--ff-head); font-size:12px; font-weight:700; color:var(--green); text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px;}
.fl-body p{font-size:12.5px; color:var(--text); line-height:1.55; margin-bottom:14px;}

.fleet-group-hd{display:flex; align-items:baseline; gap:16px; margin:64px 0 28px;}
.fleet-group-hd h3{font-family:var(--ff-head); font-size:22px; font-weight:800; color:var(--white);}
.fleet-group-hd hr{flex:1; border:none; border-top:1px solid var(--line);}

/* ===== FORM / TEAM / CONTACT ===== */
```

- [ ] **Step 2: Add `.fleet-grid` to the 980px responsive rule**

In `style.css`, find:

```css
  .fleet-card-grid, .tlr-grid{grid-template-columns:repeat(2,1fr);}
```

Replace with:

```css
  .fleet-card-grid, .tlr-grid, .fleet-grid{grid-template-columns:repeat(2,1fr);}
```

- [ ] **Step 3: Add `.fleet-grid` to the 640px responsive rule**

In `style.css`, find:

```css
  .fleet-card-grid, .tlr-grid{grid-template-columns:1fr 1fr;}
```

Replace with:

```css
  .fleet-card-grid, .tlr-grid, .fleet-grid{grid-template-columns:1fr 1fr;}
```

- [ ] **Step 4: Verify**

Run: `grep -c "fleet-grid\|fl-card\|fl-img\|fl-tag\|fl-body\|fl-cap\|fleet-group-hd" style.css`
Expected: at least 16 matches (7 base selectors + `.fl-img img`/`.fl-img::after` variants + 3 `.fleet-group-hd` sub-rules + the 2 responsive additions + the original `.fleet-card-grid` lines those responsive rules also still match).

Run: `grep -n "fc-img\|fc-tag\|fc-sub\|fc-class\|fc-name\|\.cap-hd{" style.css`
Expected: same line numbers/content as before this task — confirms the shared classes were not touched.

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "Add v3-styled fleet catalog card CSS, scoped to fleet.html"
```

---

### Task 2: Update `fleet.html`'s catalog markup

**Files:**
- Modify: `fleet.html:152-215` (Small Cranes and Big Cranes sections)

**Interfaces:**
- Consumes: `.fleet-grid`, `.fl-card`, `.fl-img`, `.fl-tag`, `.fl-body`, `.fl-cap`, `.fleet-group-hd` from Task 1.
- Produces: no new interfaces — this is the final consumer. `onclick="openModal('m-...')"` targets are unchanged, so the 8 existing modals (below this section in the same file) keep working without modification.

- [ ] **Step 1: Replace the Small Cranes section**

In `fleet.html`, find:

```html
    <div class="cap-hd fu" style="margin-bottom:24px;"><span class="eyebrow">01</span><h2 style="font-size:28px;">Small Cranes</h2></div>
    <div class="fleet-card-grid sm fu">

      <button class="fc" onclick="openModal('m-truck-815')">
        <img class="fc-img" src="images/fleet/chimes-8-15t-truck.jpg" alt="8-15 Ton Truck Mount">
        <span class="fc-sub">Truck Mount</span>
        <div class="fc-tag"><div class="fc-class">8&ndash;15 Ton Capacity</div><div class="fc-name">8&ndash;15 Ton Truck Mount</div></div>
      </button>

      <button class="fc" onclick="openModal('m-at-40')">
        <img class="fc-img" src="images/fleet/chimes-40t.jpg" alt="40 Ton All Terrain">
        <span class="fc-sub">All Terrain</span>
        <div class="fc-tag"><div class="fc-class">Tadano ATF 40G-2</div><div class="fc-name">40 Ton All Terrain</div></div>
      </button>

      <button class="fc" onclick="openModal('m-truck-30')">
        <img class="fc-img" src="images/fleet/chimes-30t.jpg" alt="30 Ton Truck Mount">
        <span class="fc-sub">Truck Mount</span>
        <div class="fc-tag"><div class="fc-class">30 Ton Capacity</div><div class="fc-name">30 Ton Truck Mount</div></div>
      </button>

      <button class="fc" onclick="openModal('m-at-50')">
        <img class="fc-img" src="images/fleet/chimes-55t.jpg" alt="55 Ton All Terrain">
        <span class="fc-sub">All Terrain</span>
        <div class="fc-tag"><div class="fc-class">55 Ton Capacity</div><div class="fc-name">55 Ton All Terrain</div></div>
      </button>

    </div>
```

Replace with:

```html
    <div class="fleet-group-hd fu"><h3>Small Cranes</h3><hr></div>
    <div class="fleet-grid fu">

      <button class="fl-card" onclick="openModal('m-truck-815')">
        <div class="fl-img"><img src="images/fleet/chimes-8-15t-truck.jpg" alt="8-15 Ton Truck Mount"><span class="fl-tag">Truck Mount</span></div>
        <div class="fl-body"><h3>8&ndash;15 Ton Truck Mount</h3><div class="fl-cap">8&ndash;15 Ton Capacity</div><p>Perfect for urban sites and tight-access projects needing fast setup.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

      <button class="fl-card" onclick="openModal('m-at-40')">
        <div class="fl-img"><img src="images/fleet/chimes-40t.jpg" alt="40 Ton All Terrain"><span class="fl-tag">All Terrain</span></div>
        <div class="fl-body"><h3>40 Ton All Terrain</h3><div class="fl-cap">Tadano ATF 40G-2</div><p>Versatile performance with excellent maneuverability on any terrain.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

      <button class="fl-card" onclick="openModal('m-truck-30')">
        <div class="fl-img"><img src="images/fleet/chimes-30t.jpg" alt="30 Ton Truck Mount"><span class="fl-tag">Truck Mount</span></div>
        <div class="fl-body"><h3>30 Ton Truck Mount</h3><div class="fl-cap">30 Ton Capacity</div><p>Cost-effective, quick-deploy solution for medium lifts.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

      <button class="fl-card" onclick="openModal('m-at-50')">
        <div class="fl-img"><img src="images/fleet/chimes-55t.jpg" alt="55 Ton All Terrain"><span class="fl-tag">All Terrain</span></div>
        <div class="fl-body"><h3>55 Ton All Terrain</h3><div class="fl-cap">55 Ton Capacity</div><p>A heavy construction powerhouse with optional jib extension.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

    </div>
```

- [ ] **Step 2: Replace the Big Cranes section**

In `fleet.html`, find:

```html
    <div class="cap-hd fu" style="margin:64px 0 24px;"><span class="eyebrow">02</span><h2 style="font-size:28px;">Big Cranes</h2></div>
    <div class="fleet-card-grid fu">

      <button class="fc" onclick="openModal('m-at-90')">
        <img class="fc-img" src="images/fleet/chimes-90t.jpg" alt="90 Ton All Terrain">
        <span class="fc-sub">All Terrain</span>
        <div class="fc-tag"><div class="fc-class">Tadano ATF 90G-4</div><div class="fc-name">90 Ton All Terrain</div></div>
      </button>

      <button class="fc" onclick="openModal('m-at-110')">
        <img class="fc-img" src="images/fleet/chimes-110t.jpg" alt="110 Ton All Terrain">
        <span class="fc-sub">All Terrain</span>
        <div class="fc-tag"><div class="fc-class">Tadano Faun ATF 110G-5</div><div class="fc-name">110 Ton All Terrain</div></div>
      </button>

      <button class="fc" onclick="openModal('m-at-220')">
        <img class="fc-img" src="images/fleet/chimes-220t.jpg" alt="220 Ton All Terrain">
        <span class="fc-sub">Premium</span>
        <div class="fc-tag"><div class="fc-class">126m With Jib</div><div class="fc-name">220 Ton All Terrain</div></div>
      </button>

      <button class="fc" onclick="openModal('m-at-400')">
        <img class="fc-img" src="images/fleet/chimes-400t.jpg" alt="400 Ton All Terrain">
        <span class="fc-sub">Flagship</span>
        <div class="fc-tag"><div class="fc-class">Our Most Powerful Unit</div><div class="fc-name">400 Ton All Terrain</div></div>
      </button>

    </div>
```

Replace with:

```html
    <div class="fleet-group-hd fu"><h3>Big Cranes</h3><hr></div>
    <div class="fleet-grid fu">

      <button class="fl-card" onclick="openModal('m-at-90')">
        <div class="fl-img"><img src="images/fleet/chimes-90t.jpg" alt="90 Ton All Terrain"><span class="fl-tag">All Terrain</span></div>
        <div class="fl-body"><h3>90 Ton All Terrain</h3><div class="fl-cap">Tadano ATF 90G-4</div><p>Industrial and petrochemical specialist for heavy modules and long reach.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

      <button class="fl-card" onclick="openModal('m-at-110')">
        <div class="fl-img"><img src="images/fleet/chimes-110t.jpg" alt="110 Ton All Terrain"><span class="fl-tag">All Terrain</span></div>
        <div class="fl-body"><h3>110 Ton All Terrain</h3><div class="fl-cap">Tadano Faun ATF 110G-5</div><p>A proven mid-range performer across petrochemical, mining and heavy construction projects.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

      <button class="fl-card" onclick="openModal('m-at-220')">
        <div class="fl-img"><img src="images/fleet/chimes-220t.jpg" alt="220 Ton All Terrain"><span class="fl-tag">Premium</span></div>
        <div class="fl-body"><h3>220 Ton All Terrain</h3><div class="fl-cap">126m With Jib</div><p>Tandem-lift capable, built for refinery and power plant operations.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

      <button class="fl-card" onclick="openModal('m-at-400')">
        <div class="fl-img"><img src="images/fleet/chimes-400t.jpg" alt="400 Ton All Terrain"><span class="fl-tag">Flagship</span></div>
        <div class="fl-body"><h3>400 Ton All Terrain</h3><div class="fl-cap">Our Most Powerful Unit</div><p>Maximum capacity for power plant and industrial mega-projects.</p><span class="hl">View Specs <span class="arrow">&rarr;</span></span></div>
      </button>

    </div>
```

- [ ] **Step 3: Verify**

Run: `grep -c "fl-card" fleet.html`
Expected: `8`

Run: `grep -c "fleet-group-hd" fleet.html`
Expected: `2`

Run: `grep -c "class=\"fc\"" fleet.html`
Expected: `0` (all 8 catalog cards converted; the modals below are untouched and don't use this class)

Run: `grep -o "openModal('[a-z0-9-]*')" fleet.html | sort -u`
Expected (8 lines): `openModal('m-at-110')`, `openModal('m-at-220')`, `openModal('m-at-40')`, `openModal('m-at-400')`, `openModal('m-at-50')`, `openModal('m-at-90')`, `openModal('m-truck-30')`, `openModal('m-truck-815')` — confirms all 8 modal IDs are still referenced (nothing broken).

- [ ] **Step 4: Commit**

```bash
git add fleet.html
git commit -m "Redesign fleet catalog cards to match v3 (shorter image crop, spec details, View Specs link)"
```

---

### Task 3: Manual verification pass (Playwright)

**Files:** none (verification only; fix-and-recommit if anything below fails)

**Interfaces:**
- Consumes: everything from Tasks 1-2.

- [ ] **Step 1: Serve the site locally**

If not already running from a prior session, start a local server from the `chimes-mockup-v4` directory (e.g. `python3 -m http.server 8790` or an equivalent static file server) and confirm `http://localhost:8790/fleet.html` loads.

- [ ] **Step 2: Visually confirm the new card format**

Use `mcp__plugin_playwright_playwright__browser_navigate` to open `fleet.html`, then `browser_take_screenshot` (both Small Cranes and Big Cranes sections, e.g. via `fullPage:true` or scrolled screenshots). Confirm: 4-column grid, each card shows a ~190px-tall photo (visibly more zoomed-out than the old tall crop) with a green capacity-tag badge bottom-left, then a dark card body below with white title, green model caption, grey description text, and a "View Specs →" line. Confirm both group headings now read as "Small Cranes ————" / "Big Cranes ————" with a rule extending to the right, not the old "01 / Small Cranes" numbered eyebrow style.

- [ ] **Step 3: Confirm hover state**

Use `browser_hover` on one card, then `browser_take_screenshot` — confirm the card lifts slightly (`translateY(-4px)`) and its border turns green, matching the pattern already used by `.tlr-card` on the Specialised Solutions page.

- [ ] **Step 4: Confirm clicking still opens the correct modal**

Use `browser_click` on a card (e.g. the 220 Ton All Terrain card), then `browser_snapshot` or `browser_take_screenshot` — confirm the correct modal (`m-at-220`, "220 Ton All Terrain") opens with its full spec table, matching the v3-style banner-image modal already in place from the prior session.

- [ ] **Step 5: Confirm responsive collapse**

Use `browser_resize` to 900×800 (between the 980px and 640px breakpoints) and take a screenshot — confirm `.fleet-grid` shows 2 columns. Resize to 500×800 and confirm it's still 2 columns (matches `.fleet-card-grid`/`.tlr-grid`'s existing behavior at that breakpoint, per Task 1 Step 3).

- [ ] **Step 6: Confirm the homepage teaser is UNCHANGED**

Use `browser_navigate` to `index.html`, scroll to the "Our Fleet" section, and take a screenshot. Confirm it still shows the original tall image-tile format (4 flagship cranes, `.fc`/`.fleet-card-grid`) — no visual change from before this plan.

- [ ] **Step 7: Fix any issues found, then commit**

If any check above fails, fix the relevant file, re-run the failing check, and commit:

```bash
git add -A
git commit -m "Fix issues found in manual verification pass"
```

If everything passed, no commit is needed for this task. Report to the user whether the `<img>`-vs-background-image technique deviation (Task 1's Global Constraints note) is acceptable, since it wasn't explicitly re-confirmed after the spec was written.
