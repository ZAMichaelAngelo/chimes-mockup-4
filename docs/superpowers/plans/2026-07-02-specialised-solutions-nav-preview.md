# Specialised Solutions Page + Nav Hover Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port v6's "Tailored Solutions" industry page into v4 (renamed "Specialised Solutions", rebuilt in v4's solid-card visual language), and add a CSS-only Apple-style hover preview + animated underline to every nav tab across the site.

**Architecture:** Static HTML/CSS site, no build step, no JS framework, no test runner. Six near-identical HTML pages each carry their own copy of the `<header>` nav and `<footer>`. Styling lives in one shared `style.css`. Verification throughout is visual: grep to confirm exact markup landed, and a Playwright browser pass at the end to confirm hover/animation behavior actually renders.

**Tech Stack:** HTML5, vanilla CSS (custom properties already defined in `:root`), no JS added.

## Global Constraints

- British spelling throughout: "Specialised Solutions" (nav label), matches existing sitewide "specialised transport" copy — never "Specialized".
- Hover preview system is CSS-only (`:hover` + `transition`) — no JavaScript added, so touch devices simply get a plain tap-through with no broken interaction.
- New page's visual language must use v4's existing solid-card pattern (`background:var(--card); border:1px solid var(--line);`, no blur/glass) — v6's `.glass`/`.aurora` system must not be copied.
- `chimes-mockup-v6` is a read-only source reference — no file in that directory is modified.
- Simple nav previews reuse existing on-site images only (no new photography) except the 6 industry images, which are copied once from v6.
- Footer nav lists are out of scope — only the header `<nav class="nav-links">` gets the new tab and preview system.

---

### Task 1: Copy the 6 industry images from v6 into v4

**Files:**
- Create: `images/tailored/construction.jpg`
- Create: `images/tailored/mining.jpg`
- Create: `images/tailored/petrochemical.webp`
- Create: `images/tailored/telecoms.jpg`
- Create: `images/tailored/renewables.jpg`
- Create: `images/tailored/industrial.webp`

**Interfaces:**
- Produces: `images/tailored/*` paths, consumed by Task 5 (rich nav preview thumbnails) and Task 6 (new page's industry cards).

- [ ] **Step 1: Create the destination folder and copy the files**

Run from the `chimes-mockup-v4` directory:

```bash
mkdir -p images/tailored
cp "../chimes-mockup-v6/images/tailored/construction.jpg" images/tailored/
cp "../chimes-mockup-v6/images/tailored/mining.jpg" images/tailored/
cp "../chimes-mockup-v6/images/tailored/petrochemical.webp" images/tailored/
cp "../chimes-mockup-v6/images/tailored/telecoms.jpg" images/tailored/
cp "../chimes-mockup-v6/images/tailored/renewables.jpg" images/tailored/
cp "../chimes-mockup-v6/images/tailored/industrial.webp" images/tailored/
```

- [ ] **Step 2: Verify all 6 files landed**

Run: `ls images/tailored/`
Expected output (6 lines, any order):
```
construction.jpg
industrial.webp
mining.jpg
petrochemical.webp
renewables.jpg
telecoms.jpg
```

- [ ] **Step 3: Commit**

```bash
git add images/tailored/
git commit -m "Copy industry images from v6 for Specialised Solutions page"
```

---

### Task 2: Animate the nav underline on hover

**Files:**
- Modify: `style.css:154-157`

**Interfaces:**
- Consumes: nothing new.
- Produces: `.nav-links a::after` now animates on both `.active` and `:hover` — Task 5's new nav markup relies on this being in place so every wrapped tab (not just the current page) shows the animated underline.

- [ ] **Step 1: Replace the static underline rule**

In `style.css`, find:

```css
.nav-links a.active, .nav-links a:hover{color:var(--white);}
.nav-links a.active::after{
  content:''; position:absolute; left:0; bottom:-2px; width:100%; height:2px; background:var(--green);
}
```

Replace with:

```css
.nav-links a.active, .nav-links a:hover{color:var(--white);}
.nav-links a::after{
  content:''; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:var(--green);
  transition:width .25s ease;
}
.nav-links a.active::after, .nav-links a:hover::after{width:100%;}
```

- [ ] **Step 2: Verify the change landed correctly**

Run: `grep -n "nav-links a::after" style.css`
Expected: one match, showing `width:0` and `transition:width .25s ease` in the declaration.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "Animate nav underline highlight on hover"
```

---

### Task 3: Add the `.nav-item` / `.nav-preview` hover system

**Files:**
- Modify: `style.css` (insert new rules; exact anchor point below)

**Interfaces:**
- Consumes: `--card`, `--line`, `--green`, `--text`, `--ff-head`, `--navy-ink` custom properties already defined in `:root` (top of `style.css`).
- Produces: `.nav-item` wrapper class, `.nav-preview` / `.nav-preview.simple` / `.nav-preview.rich` panel classes, `.np-grid` / `.np-item` / `.np-tag` inner classes. Task 5 and Task 6 markup depends on these exact class names.

- [ ] **Step 1: Insert the hover system CSS right after the nav rules**

In `style.css`, find (this is the block Task 2 already modified):

```css
.nav-ctas{display:flex; align-items:center; gap:14px;}
```

Replace with:

```css
.nav-item{position:relative;}
.nav-preview{
  position:absolute; top:calc(100% + 18px); left:50%;
  transform:translate(-50%, 6px);
  opacity:0; pointer-events:none;
  transition:opacity .2s ease, transform .2s ease;
  background:var(--card); border:1px solid var(--line);
  box-shadow:0 20px 40px rgba(0,0,0,.35);
  z-index:100;
}
.nav-item:hover .nav-preview{opacity:1; pointer-events:auto; transform:translate(-50%, 0);}
.nav-item:last-child .nav-preview{left:auto; right:0; transform:translateY(6px);}
.nav-item:last-child:hover .nav-preview{transform:translateY(0);}

.nav-preview.simple{width:260px; padding:14px;}
.nav-preview.simple img{width:100%; height:140px; object-fit:cover; display:block; margin-bottom:12px;}
.nav-preview.simple .np-tag{font-family:var(--ff-head); font-size:13px; font-weight:700; color:var(--text); line-height:1.4;}

.nav-preview.rich{width:400px; padding:16px;}
.nav-preview.rich .np-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:10px;}
.nav-preview.rich .np-item{display:block; text-align:center;}
.nav-preview.rich .np-item img{width:100%; height:64px; object-fit:cover; display:block; margin-bottom:6px; transition:opacity .2s ease;}
.nav-preview.rich .np-item:hover img{opacity:.75;}
.nav-preview.rich .np-item span{font-family:var(--ff-head); font-size:10.5px; font-weight:700; letter-spacing:.03em; text-transform:uppercase; color:var(--text);}

.nav-ctas{display:flex; align-items:center; gap:14px;}
```

- [ ] **Step 2: Disable the preview system inside the mobile hamburger menu**

In `style.css`, find (inside the `@media (max-width:980px)` block):

```css
  .nav-links.open a{padding:10px 0; width:100%;}
```

Replace with:

```css
  .nav-links.open .nav-item{width:100%;}
  .nav-links.open a{padding:10px 0; width:100%;}
  .nav-links.open .nav-preview{display:none;}
```

- [ ] **Step 3: Verify both changes landed**

Run: `grep -n "nav-item\|nav-preview" style.css | head -20`
Expected: matches for `.nav-item{position:relative` , `.nav-preview{`, `.nav-preview.simple`, `.nav-preview.rich`, and `.nav-links.open .nav-preview{display:none;}`.

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "Add CSS-only nav hover preview system"
```

---

### Task 4: Add `.tlr-*` card styles for the Specialised Solutions page

**Files:**
- Modify: `style.css` (insert new rules; exact anchor point below)
- Modify: `style.css:787` (add `.tlr-grid` to existing responsive rules)
- Modify: `style.css:798` (add `.tlr-grid` to existing responsive rules)

**Interfaces:**
- Consumes: `--card`, `--line`, `--green`, `--text` custom properties.
- Produces: `.tlr-grid`, `.tlr-card`, `.tlr-img`, `.tlr-body` classes. Task 6's new page markup depends on these exact class names.

- [ ] **Step 1: Insert the card styles after the CTA rules**

In `style.css`, find:

```css
.quote-grid{display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; position:relative; z-index:1;}
@media (max-width:980px){.quote-grid{grid-template-columns:1fr; gap:40px;}}
```

Replace with:

```css
.quote-grid{display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; position:relative; z-index:1;}
@media (max-width:980px){.quote-grid{grid-template-columns:1fr; gap:40px;}}

/* ===== SPECIALISED SOLUTIONS PAGE ===== */
.tlr-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:18px;}
.tlr-card{background:var(--card); border:1px solid var(--line); transition:transform .25s ease, border-color .25s ease;}
.tlr-card:hover{transform:translateY(-4px); border-color:var(--green);}
.tlr-img{height:200px; background-size:cover; background-position:center;}
.tlr-body{padding:24px;}
.tlr-body h3{font-size:19px; margin-bottom:8px;}
.tlr-body p{font-size:14px; color:var(--text);}
```

- [ ] **Step 2: Add `.tlr-grid` to the 980px responsive rule**

In `style.css`, find:

```css
  .fleet-card-grid{grid-template-columns:repeat(2,1fr);}
```

Replace with:

```css
  .fleet-card-grid, .tlr-grid{grid-template-columns:repeat(2,1fr);}
```

- [ ] **Step 3: Add `.tlr-grid` to the 640px responsive rule**

In `style.css`, find:

```css
  .fleet-card-grid{grid-template-columns:1fr 1fr;}
```

Replace with:

```css
  .fleet-card-grid, .tlr-grid{grid-template-columns:1fr 1fr;}
```

- [ ] **Step 4: Verify**

Run: `grep -n "tlr-grid\|tlr-card\|tlr-img\|tlr-body" style.css`
Expected: 6 matches — the 4 base rules plus the two responsive overrides.

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "Add v4-styled card rules for Specialised Solutions page"
```

---

### Task 5: Update nav markup on all 5 existing pages

**Files:**
- Modify: `index.html:100-106`
- Modify: `fleet.html:86-92`
- Modify: `galleries.html:86-92`
- Modify: `contact.html:86-92`
- Modify: `privacy.html:59-65`

**Interfaces:**
- Consumes: `.nav-item`, `.nav-preview`, `.nav-preview.simple`, `.nav-preview.rich`, `.np-grid`, `.np-item`, `.np-tag` from Task 3. `images/tailored/*.jpg|.webp` from Task 1.
- Produces: the canonical 6-tab nav block (with previews) that Task 6's new page also uses. New tab order: Home → Fleet & Specs → Specialised Solutions → Galleries → Who We Are → Contact.

- [ ] **Step 1: Update `index.html`**

Find:

```html
    <nav class="nav-links" id="nav">
      <a href="index.html" class="active">Home</a>
      <a href="fleet.html">Fleet &amp; Specs</a>
      <a href="galleries.html">Galleries</a>
      <a href="index.html#about">Who We Are</a>
      <a href="contact.html">Contact</a>
    </nav>
```

Replace with:

```html
    <nav class="nav-links" id="nav">
      <div class="nav-item">
        <a href="index.html" class="active">Home</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/BARLOW%20pic%20%231.jpg" alt="">
          <div class="np-tag">We Lift. South Africa Builds.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="fleet.html">Fleet &amp; Specs</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/crane%20LBBD%20%231.jpg" alt="">
          <div class="np-tag">8 To 400 Ton Tadano Fleet, Fully Specced.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="tailored-solutions.html">Specialised Solutions</a>
        <div class="nav-preview rich">
          <div class="np-grid">
            <a class="np-item" href="tailored-solutions.html#construction"><img src="images/tailored/construction.jpg" alt=""><span>Construction</span></a>
            <a class="np-item" href="tailored-solutions.html#mining"><img src="images/tailored/mining.jpg" alt=""><span>Mining</span></a>
            <a class="np-item" href="tailored-solutions.html#petrochemical"><img src="images/tailored/petrochemical.webp" alt=""><span>Petrochemical</span></a>
            <a class="np-item" href="tailored-solutions.html#telecoms"><img src="images/tailored/telecoms.jpg" alt=""><span>Telecoms</span></a>
            <a class="np-item" href="tailored-solutions.html#renewables"><img src="images/tailored/renewables.jpg" alt=""><span>Renewables</span></a>
            <a class="np-item" href="tailored-solutions.html#industrial"><img src="images/tailored/industrial.webp" alt=""><span>General Industrial</span></a>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <a href="galleries.html">Galleries</a>
        <div class="nav-preview simple">
          <img src="images/gallery/onsite-lbbd3.jpg" alt="">
          <div class="np-tag">See The Fleet On Site.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="index.html#about">Who We Are</a>
        <div class="nav-preview simple">
          <img src="images/the_team.webp" alt="">
          <div class="np-tag">Owner-Managed. Hands-On Since 2003.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="contact.html">Contact</a>
        <div class="nav-preview simple">
          <img src="images/office1.webp" alt="">
          <div class="np-tag">Call, WhatsApp, Or Request A Quote.</div>
        </div>
      </div>
    </nav>
```

- [ ] **Step 2: Update `fleet.html`**

Find:

```html
    <nav class="nav-links" id="nav">
      <a href="index.html">Home</a>
      <a href="fleet.html" class="active">Fleet &amp; Specs</a>
      <a href="galleries.html">Galleries</a>
      <a href="index.html#about">Who We Are</a>
      <a href="contact.html">Contact</a>
    </nav>
```

Replace with the same block as Step 1, except `<a href="index.html">Home</a>` (no `active`) and `<a href="fleet.html" class="active">Fleet &amp; Specs</a>`. Full block:

```html
    <nav class="nav-links" id="nav">
      <div class="nav-item">
        <a href="index.html">Home</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/BARLOW%20pic%20%231.jpg" alt="">
          <div class="np-tag">We Lift. South Africa Builds.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="fleet.html" class="active">Fleet &amp; Specs</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/crane%20LBBD%20%231.jpg" alt="">
          <div class="np-tag">8 To 400 Ton Tadano Fleet, Fully Specced.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="tailored-solutions.html">Specialised Solutions</a>
        <div class="nav-preview rich">
          <div class="np-grid">
            <a class="np-item" href="tailored-solutions.html#construction"><img src="images/tailored/construction.jpg" alt=""><span>Construction</span></a>
            <a class="np-item" href="tailored-solutions.html#mining"><img src="images/tailored/mining.jpg" alt=""><span>Mining</span></a>
            <a class="np-item" href="tailored-solutions.html#petrochemical"><img src="images/tailored/petrochemical.webp" alt=""><span>Petrochemical</span></a>
            <a class="np-item" href="tailored-solutions.html#telecoms"><img src="images/tailored/telecoms.jpg" alt=""><span>Telecoms</span></a>
            <a class="np-item" href="tailored-solutions.html#renewables"><img src="images/tailored/renewables.jpg" alt=""><span>Renewables</span></a>
            <a class="np-item" href="tailored-solutions.html#industrial"><img src="images/tailored/industrial.webp" alt=""><span>General Industrial</span></a>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <a href="galleries.html">Galleries</a>
        <div class="nav-preview simple">
          <img src="images/gallery/onsite-lbbd3.jpg" alt="">
          <div class="np-tag">See The Fleet On Site.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="index.html#about">Who We Are</a>
        <div class="nav-preview simple">
          <img src="images/the_team.webp" alt="">
          <div class="np-tag">Owner-Managed. Hands-On Since 2003.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="contact.html">Contact</a>
        <div class="nav-preview simple">
          <img src="images/office1.webp" alt="">
          <div class="np-tag">Call, WhatsApp, Or Request A Quote.</div>
        </div>
      </div>
    </nav>
```

- [ ] **Step 3: Update `galleries.html`**

Find:

```html
    <nav class="nav-links" id="nav">
      <a href="index.html">Home</a>
      <a href="fleet.html">Fleet &amp; Specs</a>
      <a href="galleries.html" class="active">Galleries</a>
      <a href="index.html#about">Who We Are</a>
      <a href="contact.html">Contact</a>
    </nav>
```

Replace with the same block, with `Home` and `Fleet & Specs` non-active and `Galleries` active:

```html
    <nav class="nav-links" id="nav">
      <div class="nav-item">
        <a href="index.html">Home</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/BARLOW%20pic%20%231.jpg" alt="">
          <div class="np-tag">We Lift. South Africa Builds.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="fleet.html">Fleet &amp; Specs</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/crane%20LBBD%20%231.jpg" alt="">
          <div class="np-tag">8 To 400 Ton Tadano Fleet, Fully Specced.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="tailored-solutions.html">Specialised Solutions</a>
        <div class="nav-preview rich">
          <div class="np-grid">
            <a class="np-item" href="tailored-solutions.html#construction"><img src="images/tailored/construction.jpg" alt=""><span>Construction</span></a>
            <a class="np-item" href="tailored-solutions.html#mining"><img src="images/tailored/mining.jpg" alt=""><span>Mining</span></a>
            <a class="np-item" href="tailored-solutions.html#petrochemical"><img src="images/tailored/petrochemical.webp" alt=""><span>Petrochemical</span></a>
            <a class="np-item" href="tailored-solutions.html#telecoms"><img src="images/tailored/telecoms.jpg" alt=""><span>Telecoms</span></a>
            <a class="np-item" href="tailored-solutions.html#renewables"><img src="images/tailored/renewables.jpg" alt=""><span>Renewables</span></a>
            <a class="np-item" href="tailored-solutions.html#industrial"><img src="images/tailored/industrial.webp" alt=""><span>General Industrial</span></a>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <a href="galleries.html" class="active">Galleries</a>
        <div class="nav-preview simple">
          <img src="images/gallery/onsite-lbbd3.jpg" alt="">
          <div class="np-tag">See The Fleet On Site.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="index.html#about">Who We Are</a>
        <div class="nav-preview simple">
          <img src="images/the_team.webp" alt="">
          <div class="np-tag">Owner-Managed. Hands-On Since 2003.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="contact.html">Contact</a>
        <div class="nav-preview simple">
          <img src="images/office1.webp" alt="">
          <div class="np-tag">Call, WhatsApp, Or Request A Quote.</div>
        </div>
      </div>
    </nav>
```

- [ ] **Step 4: Update `contact.html`**

Find:

```html
    <nav class="nav-links" id="nav">
      <a href="index.html">Home</a>
      <a href="fleet.html">Fleet &amp; Specs</a>
      <a href="galleries.html">Galleries</a>
      <a href="index.html#about">Who We Are</a>
      <a href="contact.html" class="active">Contact</a>
    </nav>
```

Replace with the same block, with `Contact` active:

```html
    <nav class="nav-links" id="nav">
      <div class="nav-item">
        <a href="index.html">Home</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/BARLOW%20pic%20%231.jpg" alt="">
          <div class="np-tag">We Lift. South Africa Builds.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="fleet.html">Fleet &amp; Specs</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/crane%20LBBD%20%231.jpg" alt="">
          <div class="np-tag">8 To 400 Ton Tadano Fleet, Fully Specced.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="tailored-solutions.html">Specialised Solutions</a>
        <div class="nav-preview rich">
          <div class="np-grid">
            <a class="np-item" href="tailored-solutions.html#construction"><img src="images/tailored/construction.jpg" alt=""><span>Construction</span></a>
            <a class="np-item" href="tailored-solutions.html#mining"><img src="images/tailored/mining.jpg" alt=""><span>Mining</span></a>
            <a class="np-item" href="tailored-solutions.html#petrochemical"><img src="images/tailored/petrochemical.webp" alt=""><span>Petrochemical</span></a>
            <a class="np-item" href="tailored-solutions.html#telecoms"><img src="images/tailored/telecoms.jpg" alt=""><span>Telecoms</span></a>
            <a class="np-item" href="tailored-solutions.html#renewables"><img src="images/tailored/renewables.jpg" alt=""><span>Renewables</span></a>
            <a class="np-item" href="tailored-solutions.html#industrial"><img src="images/tailored/industrial.webp" alt=""><span>General Industrial</span></a>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <a href="galleries.html">Galleries</a>
        <div class="nav-preview simple">
          <img src="images/gallery/onsite-lbbd3.jpg" alt="">
          <div class="np-tag">See The Fleet On Site.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="index.html#about">Who We Are</a>
        <div class="nav-preview simple">
          <img src="images/the_team.webp" alt="">
          <div class="np-tag">Owner-Managed. Hands-On Since 2003.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="contact.html" class="active">Contact</a>
        <div class="nav-preview simple">
          <img src="images/office1.webp" alt="">
          <div class="np-tag">Call, WhatsApp, Or Request A Quote.</div>
        </div>
      </div>
    </nav>
```

- [ ] **Step 5: Update `privacy.html`**

Find:

```html
    <nav class="nav-links" id="nav">
      <a href="index.html">Home</a>
      <a href="fleet.html">Fleet &amp; Specs</a>
      <a href="galleries.html">Galleries</a>
      <a href="index.html#about">Who We Are</a>
      <a href="contact.html">Contact</a>
    </nav>
```

Replace with the same block, with no tab active (matches privacy.html's existing behaviour — none of its tabs are ever marked active):

```html
    <nav class="nav-links" id="nav">
      <div class="nav-item">
        <a href="index.html">Home</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/BARLOW%20pic%20%231.jpg" alt="">
          <div class="np-tag">We Lift. South Africa Builds.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="fleet.html">Fleet &amp; Specs</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/crane%20LBBD%20%231.jpg" alt="">
          <div class="np-tag">8 To 400 Ton Tadano Fleet, Fully Specced.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="tailored-solutions.html">Specialised Solutions</a>
        <div class="nav-preview rich">
          <div class="np-grid">
            <a class="np-item" href="tailored-solutions.html#construction"><img src="images/tailored/construction.jpg" alt=""><span>Construction</span></a>
            <a class="np-item" href="tailored-solutions.html#mining"><img src="images/tailored/mining.jpg" alt=""><span>Mining</span></a>
            <a class="np-item" href="tailored-solutions.html#petrochemical"><img src="images/tailored/petrochemical.webp" alt=""><span>Petrochemical</span></a>
            <a class="np-item" href="tailored-solutions.html#telecoms"><img src="images/tailored/telecoms.jpg" alt=""><span>Telecoms</span></a>
            <a class="np-item" href="tailored-solutions.html#renewables"><img src="images/tailored/renewables.jpg" alt=""><span>Renewables</span></a>
            <a class="np-item" href="tailored-solutions.html#industrial"><img src="images/tailored/industrial.webp" alt=""><span>General Industrial</span></a>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <a href="galleries.html">Galleries</a>
        <div class="nav-preview simple">
          <img src="images/gallery/onsite-lbbd3.jpg" alt="">
          <div class="np-tag">See The Fleet On Site.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="index.html#about">Who We Are</a>
        <div class="nav-preview simple">
          <img src="images/the_team.webp" alt="">
          <div class="np-tag">Owner-Managed. Hands-On Since 2003.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="contact.html">Contact</a>
        <div class="nav-preview simple">
          <img src="images/office1.webp" alt="">
          <div class="np-tag">Call, WhatsApp, Or Request A Quote.</div>
        </div>
      </div>
    </nav>
```

- [ ] **Step 6: Verify all 5 files got the new tab and wrapper markup**

Run: `grep -lc "Specialised Solutions" index.html fleet.html galleries.html contact.html privacy.html`
Expected: all 5 files listed, each with a count ≥ 1.

Run: `grep -c "class=\"nav-item\"" index.html fleet.html galleries.html contact.html privacy.html`
Expected: `6` for every file (one `.nav-item` per tab).

- [ ] **Step 7: Commit**

```bash
git add index.html fleet.html galleries.html contact.html privacy.html
git commit -m "Add Specialised Solutions tab and hover previews to site nav"
```

---

### Task 6: Create `tailored-solutions.html`

**Files:**
- Create: `tailored-solutions.html`

**Interfaces:**
- Consumes: `.tlr-grid`/`.tlr-card`/`.tlr-img`/`.tlr-body` (Task 4), `.nav-item`/`.nav-preview` system (Task 3), `images/tailored/*` (Task 1), the canonical nav block (Task 5, with `Specialised Solutions` marked `active` and no other tab active).
- Produces: `tailored-solutions.html`, linked from every other page's nav (already wired in Task 5) and from the rich preview's 6 anchor links (`#construction`, `#mining`, `#petrochemical`, `#telecoms`, `#renewables`, `#industrial`).

- [ ] **Step 1: Create the file**

Create `tailored-solutions.html` with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Security headers: see index.html for the full explanation of what's covered here
       vs. what needs setting at the real hosting layer (X-Frame-Options etc). -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; frame-src https://www.google.com https://maps.google.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com; object-src 'none'; base-uri 'self'; form-action 'self';">
  <meta name="referrer" content="strict-origin-when-cross-origin">

  <!-- Google Tag Manager — uncomment with the real container ID when ready to go live.
       See index.html for the full explanation; dataLayer events already fire site-wide. -->
  <!--
  <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');
  </script>
  -->

  <title>Specialised Solutions — Chimes Crane Hire</title>
  <meta name="description" content="Chimes Crane Hire specialised lifting solutions by industry — Construction, Mining, Petrochemical, Telecoms, Renewables and General Industrial.">

  <!-- SEO: temporary mockup URL, see index.html for full explanation. -->
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://zamichaelangelo.github.io/chimes-mockup-4/tailored-solutions.html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Chimes Crane Hire">
  <meta property="og:title" content="Specialised Solutions — Chimes Crane Hire">
  <meta property="og:description" content="Chimes Crane Hire specialised lifting solutions by industry — Construction, Mining, Petrochemical, Telecoms, Renewables and General Industrial.">
  <meta property="og:url" content="https://zamichaelangelo.github.io/chimes-mockup-4/tailored-solutions.html">
  <meta property="og:image" content="https://zamichaelangelo.github.io/chimes-mockup-4/images/tailored/petrochemical.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Specialised Solutions — Chimes Crane Hire">
  <meta name="twitter:description" content="Chimes Crane Hire specialised lifting solutions by industry — Construction, Mining, Petrochemical, Telecoms, Renewables and General Industrial.">
  <meta name="twitter:image" content="https://zamichaelangelo.github.io/chimes-mockup-4/images/tailored/petrochemical.webp">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="favicon-180.png">
  <link rel="stylesheet" href="style.css?v=13">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Chimes Crane Hire (Pty) Ltd",
    "image": "https://zamichaelangelo.github.io/chimes-mockup-4/images/tailored/petrochemical.webp",
    "url": "https://chimescranes.co.za",
    "telephone": "+27-11-626-1110",
    "email": "office@chimes.co.za",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nasmith Avenue, Jupiter Industrial",
      "addressLocality": "Germiston",
      "addressRegion": "Gauteng",
      "addressCountry": "ZA"
    },
    "foundingDate": "2003",
    "sameAs": ["https://www.facebook.com/ChimesCraneHire/"],
    "areaServed": "Gauteng, South Africa",
    "priceRange": "$$"
  }
  </script>
</head>
<body>
<!-- Google Tag Manager (noscript) — uncomment with the snippet in <head>.
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
-->

<div id="pageTrans"></div>

<!-- NAV -->
<header id="hdr">
  <div class="nav-wrap">
    <a href="index.html" class="logo-link"><img src="Logos/Official_Chimes_Extended_Logo.png" alt="Chimes Crane Hire"></a>
    <button class="hbg" id="hbg" aria-label="Menu">
      <svg width="22" height="15" viewBox="0 0 22 15" fill="none"><rect y="0" width="22" height="2.5" rx="1"/><rect y="6" width="22" height="2.5" rx="1"/><rect y="12" width="22" height="2.5" rx="1"/></svg>
    </button>
    <nav class="nav-links" id="nav">
      <div class="nav-item">
        <a href="index.html">Home</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/BARLOW%20pic%20%231.jpg" alt="">
          <div class="np-tag">We Lift. South Africa Builds.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="fleet.html">Fleet &amp; Specs</a>
        <div class="nav-preview simple">
          <img src="Cinematic%20Images/crane%20LBBD%20%231.jpg" alt="">
          <div class="np-tag">8 To 400 Ton Tadano Fleet, Fully Specced.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="tailored-solutions.html" class="active">Specialised Solutions</a>
        <div class="nav-preview rich">
          <div class="np-grid">
            <a class="np-item" href="tailored-solutions.html#construction"><img src="images/tailored/construction.jpg" alt=""><span>Construction</span></a>
            <a class="np-item" href="tailored-solutions.html#mining"><img src="images/tailored/mining.jpg" alt=""><span>Mining</span></a>
            <a class="np-item" href="tailored-solutions.html#petrochemical"><img src="images/tailored/petrochemical.webp" alt=""><span>Petrochemical</span></a>
            <a class="np-item" href="tailored-solutions.html#telecoms"><img src="images/tailored/telecoms.jpg" alt=""><span>Telecoms</span></a>
            <a class="np-item" href="tailored-solutions.html#renewables"><img src="images/tailored/renewables.jpg" alt=""><span>Renewables</span></a>
            <a class="np-item" href="tailored-solutions.html#industrial"><img src="images/tailored/industrial.webp" alt=""><span>General Industrial</span></a>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <a href="galleries.html">Galleries</a>
        <div class="nav-preview simple">
          <img src="images/gallery/onsite-lbbd3.jpg" alt="">
          <div class="np-tag">See The Fleet On Site.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="index.html#about">Who We Are</a>
        <div class="nav-preview simple">
          <img src="images/the_team.webp" alt="">
          <div class="np-tag">Owner-Managed. Hands-On Since 2003.</div>
        </div>
      </div>
      <div class="nav-item">
        <a href="contact.html">Contact</a>
        <div class="nav-preview simple">
          <img src="images/office1.webp" alt="">
          <div class="np-tag">Call, WhatsApp, Or Request A Quote.</div>
        </div>
      </div>
    </nav>
    <div class="nav-ctas">
      <a href="tel:+27116261110" class="btn-out">+27 11 626 1110</a>
      <a href="contact.html#quote" class="btn-fill">Get a Quote</a>
    </div>
  </div>
</header>

<!-- PAGE HERO -->
<section class="page-hero-v4" style="background-image:url('images/tailored/petrochemical.webp');">
  <div class="page-hero-v4-cnt">
    <span class="eyebrow">Specialised Solutions</span>
    <h1>The Right Crane.<br>For Your <span class="hl">Industry.</span></h1>
    <p>Every sector lifts differently. Here's how Chimes' fleet, riggers and lift planning adapt to the work you actually do.</p>
  </div>
</section>

<!-- INDUSTRY GRID -->
<section class="sec">
  <div class="sec-inner">
    <div class="tlr-grid fu">
      <div class="tlr-card" id="construction">
        <div class="tlr-img" style="background-image:url('images/tailored/construction.jpg');"></div>
        <div class="tlr-body"><h3>Steel &amp; Construction</h3><p>From foundations to steel erection, our cranes handle material handling and structural lifts on construction sites of every size across Gauteng.</p></div>
      </div>
      <div class="tlr-card" id="mining">
        <div class="tlr-img" style="background-image:url('images/tailored/mining.jpg');"></div>
        <div class="tlr-body"><h3>Mining</h3><p>Rough-terrain and all-terrain units built for shaft equipment, bulk material handling and heavy components on demanding mine sites.</p></div>
      </div>
      <div class="tlr-card" id="petrochemical">
        <div class="tlr-img" style="background-image:url('images/tailored/petrochemical.webp');"></div>
        <div class="tlr-body"><h3>Petrochemical</h3><p>Tandem-lift capable cranes for refinery turnarounds, tank erection and flare stack work, handled to petrochemical safety standards.</p></div>
      </div>
      <div class="tlr-card" id="telecoms">
        <div class="tlr-img" style="background-image:url('images/tailored/telecoms.jpg');"></div>
        <div class="tlr-body"><h3>Telecoms</h3><p>Mast and tower lifts for telecoms rollouts, carried out by certified riggers who understand confined access and live-site safety.</p></div>
      </div>
      <div class="tlr-card" id="renewables">
        <div class="tlr-img" style="background-image:url('images/tailored/renewables.jpg');"></div>
        <div class="tlr-body"><h3>Renewable Energy</h3><p>Wind turbine component handling and solar infrastructure lifts, supporting South Africa's renewable energy build-out.</p></div>
      </div>
      <div class="tlr-card" id="industrial">
        <div class="tlr-img" style="background-image:url('images/tailored/industrial.webp');"></div>
        <div class="tlr-body"><h3>General Industrial</h3><p>Plant equipment installs, machinery relocations and heavy component lifts for factories and processing plants across the region.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-v4">
  <div class="stripe-corner"><span></span><span class="s2"></span></div>
  <div class="cta-v4-inner fu">
    <span class="eyebrow">Not Sure Which Fits?</span>
    <h2>Tell Us The Job.<br>We'll <span class="hl">Tailor The Lift.</span></h2>
    <a href="contact.html#quote" class="btn-grn">Get A Quote</a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="sec-inner">
    <div class="ft-top">
      <div class="ft-brand">
        <img src="Logos/Official_Chimes_Extended_Logo.png" alt="Chimes Crane Hire">
        <p>Chimes Crane Hire (Pty) Ltd — raising the standard in mobile crane hire, rigging and specialised transport across South Africa since 2003.</p>
        <!-- PLACEHOLDER: pending confirmed BEE certificate — verify level + expiry before launch. -->
        <div class="bee bee-ft">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--green)"><path d="M10 2L12.4 7.2L18 8L14 11.8L15.1 17.4L10 14.7L4.9 17.4L6 11.8L2 8L7.6 7.2Z"/></svg>
          <span>BEE Level 4 Contributor</span>
        </div>
        <a href="https://www.facebook.com/ChimesCraneHire/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="ft-social">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </a>
      </div>
      <div class="ft-col">
        <h5>Company</h5>
        <ul>
          <li><a href="index.html#about">About</a></li>
          <li><a href="fleet.html">Fleet</a></li>
          <li><a href="galleries.html">Galleries</a></li>
          <li><a href="contact.html#team">Team</a></li>
        </ul>
      </div>
      <div class="ft-col">
        <h5>Services</h5>
        <ul>
          <li><a href="index.html#services">Crane Hire</a></li>
          <li><a href="index.html#services">Rigging</a></li>
          <li><a href="index.html#services">Transport</a></li>
          <li><a href="index.html#services">Lift Planning</a></li>
        </ul>
      </div>
      <div class="ft-col">
        <h5>Contact</h5>
        <p style="font-size:14px; color:var(--muted); margin-bottom:8px;">+27 11 626 1110</p>
        <p style="font-size:14px; margin-bottom:8px;"><a href="mailto:office@chimes.co.za">office@chimes.co.za</a></p>
        <p style="font-size:14px; color:var(--muted); margin-bottom:8px;">Nasmith Ave, Jupiter Industrial,<br>Germiston, Johannesburg</p>
        <p style="font-size:14px; color:var(--muted);">+27 11 626 2267 (Fax)</p>
      </div>
    </div>
    <div class="ft-bot">
      <p>&copy; 2026 Chimes Crane Hire (Pty) Ltd. &middot; <a href="privacy.html" class="ft-bot-link">Privacy Policy</a></p>
      <span class="ft-tag">Navy For Authority &middot; Green For Go</span>
    </div>
  </div>
</footer>

<div class="cookie-banner" id="cookieBanner">
  <p>We use cookies to understand how visitors use this site and measure ad performance. See our <a href="privacy.html">Privacy Policy</a> for details.</p>
  <div class="cookie-banner-btns">
    <button class="cb-decline" id="cbDecline" type="button">Decline</button>
    <button class="cb-accept" id="cbAccept" type="button">Accept</button>
  </div>
</div>

<a href="https://wa.me/27823891573" class="wa-fab" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
  <span class="wa-pulse"></span>
  <svg viewBox="0 0 24 24" fill="#0a1420"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-1.7-.7-2.8-2.4-2.9-2.5-.1-.2 0-.3.1-.4l.5-.6c.1-.2.1-.3 0-.5l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.4c-.2 0-.4.1-.5.3-.2.2-.7.7-.7 1.7s.7 2 .8 2.1c.1.2 1.6 2.4 3.9 3.3 1.9.7 2.3.6 2.6.5.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1z"/></svg>
  <span class="wa-label">Chat On WhatsApp</span>
</a>

<script src="script.js?v=5"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file was created and the anchors are present**

Run: `grep -c "tlr-card" tailored-solutions.html`
Expected: `6`

Run: `grep -o 'id="[a-z]*"' tailored-solutions.html`
Expected (6 lines, in this order): `id="construction"`, `id="mining"`, `id="petrochemical"`, `id="telecoms"`, `id="renewables"`, `id="industrial"`

- [ ] **Step 3: Commit**

```bash
git add tailored-solutions.html
git commit -m "Add Specialised Solutions page ported from v6"
```

---

### Task 7: Manual verification pass (Playwright)

**Files:** none (verification only; fix-and-recommit if anything below fails)

**Interfaces:**
- Consumes: everything from Tasks 1-6.

- [ ] **Step 1: Serve the site locally**

Run (from the `chimes-mockup-v4` directory, background process):

```bash
python -m http.server 8790
```

- [ ] **Step 2: Load the homepage and confirm the new tab is present and in the right order**

Use `mcp__plugin_playwright_playwright__browser_navigate` to open `http://localhost:8790/index.html`, then `mcp__plugin_playwright_playwright__browser_snapshot` to confirm the nav reads: Home, Fleet & Specs, Specialised Solutions, Galleries, Who We Are, Contact — in that order.

- [ ] **Step 3: Confirm the animated underline**

Use `mcp__plugin_playwright_playwright__browser_hover` on the "Galleries" tab (a non-active tab), then `mcp__plugin_playwright_playwright__browser_take_screenshot` — confirm a green underline is visible beneath it (it wasn't there pre-hover, per Task 2's `width:0` default).

- [ ] **Step 4: Confirm the rich preview**

Use `mcp__plugin_playwright_playwright__browser_hover` on "Specialised Solutions", then `browser_take_screenshot` — confirm a 3×2 grid of 6 industry thumbnails appears below the tab.

- [ ] **Step 5: Confirm a simple preview**

Use `mcp__plugin_playwright_playwright__browser_hover` on "Contact", then `browser_take_screenshot` — confirm a single image + one-line tagline appears, right-aligned under the tab (not clipped off the right edge of the viewport).

- [ ] **Step 6: Confirm the new page renders and anchors work**

Use `mcp__plugin_playwright_playwright__browser_navigate` to `http://localhost:8790/tailored-solutions.html`, then `browser_snapshot` — confirm 6 industry cards render with v4's solid dark-card styling (not glass/blur), and "Specialised Solutions" is the active tab. Click the "Petrochemical" thumbnail from the rich nav preview on another page (e.g. from `index.html`) and confirm it scrolls to the `#petrochemical` card.

- [ ] **Step 7: Confirm mobile nav still works**

Use `mcp__plugin_playwright_playwright__browser_resize` to a narrow width (e.g. 375×800), open the hamburger menu, and confirm all 6 tabs stack correctly with no leftover hover-preview panel visible (Task 3 Step 2's `display:none` rule).

- [ ] **Step 8: Fix any issues found, then commit**

If any check above fails, fix the relevant file, re-run the failing check, and commit:

```bash
git add -A
git commit -m "Fix issues found in manual verification pass"
```

If everything passed, no commit is needed for this task.
