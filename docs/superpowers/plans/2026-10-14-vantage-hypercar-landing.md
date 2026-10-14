# VANTAGE Hypercar Landing Page Implementation Plan

> **For agentic workers:** Use this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build the approved Portuguese VANTAGE hypercar landing page in Astro, with original optimized visuals, restrained parallax, and a same-page private presentation CTA.

**Architecture:** Keep the existing Astro app and implement the single route in `src/pages/index.astro`, updating the shared layout metadata in `src/layouts/Layout.astro`. Store generated responsive visuals under `public/images/vantage/`; use native CSS and a small page script, without new dependencies.

**Tech Stack:** Astro 7, HTML, CSS, native JavaScript.

**Spec:** `docs/superpowers/specs/2026-10-14-vantage-luxury-hypercar-design.md`

**Final asset note:** The image set evolved during visual refinement. The route in `src/pages/index.astro` is the source of truth for the curated files; intermediate generated images were removed before commit.

## Global Constraints

- Use Astro.js and the existing dependencies; add no framework or animation library.
- Site language and copy: Portuguese.
- Palette: Obsidiana `#0B0D0F`, Grafite `#202427`, Titânio `#B8BEC0`, Névoa `#E8E9E6`, Ardósia `#777F82`, Verde mineral `#82918A`.
- CTA stays on-page; do not collect or send data.
- Parallax uses a small image transform, reduced on mobile and disabled for `prefers-reduced-motion`.
- Provide original generated VANTAGE imagery; no placeholder or stock hero.

## Review Focus

- Reduced-motion preference: parallax and entrance motion become static.
- Narrow viewport: car crops preserve the vehicle and the page has no horizontal overflow.
- Keyboard and touch: navigation and CTA remain usable with visible focus and comfortable targets.
- Slow image loading: aspect ratios reserve space and below-fold images load lazily.
- No contact backend: CTA moves only to the private invitation section and submits nothing.

---

### Task 1: Produce the VANTAGE image set

**Files:**
- Create: `public/images/vantage/hero.jpg`
- Create: `public/images/vantage/aurelion.jpg`
- Create: `public/images/vantage/front-bumper-v2.jpg`
- Create: `public/images/vantage/v12-engine-v2.jpg`
- Create: `public/images/vantage/cockpit-bespoke-v3.jpg`
- Create: `public/images/vantage/serein-track.jpg`
- Create: `public/images/vantage/eclipse-atelier.jpg`
- Create: `public/images/vantage/film-start.jpg`
- Create: `public/images/vantage/closing-horizon.jpg`

**Interfaces:**
- Produces: the curated image set used by the route, with a consistent silver-titanium VANTAGE design and varied compositions.

- [x] Generate the hero: wide, low three-quarter front view, car toward the right with dark negative space at left, coastal mountain road before dawn.
- [x] Generate Aurelion: wide side profile in a quiet architectural setting, silver body and graphite cockpit.
- [x] Generate a close exterior detail with the VANTAGE emblem, forged wheel, and carbon fiber.
- [x] Generate the hand-assembled V12, plus a left-hand-drive bespoke cockpit.
- [x] Generate Serein at a wet track and Éclipse in a private atelier, with different settings from the hero.
- [x] Add a cinematic film poster and the closing horizon image; preserve each asset's native aspect ratio in the page.

**Check:** Open each generated image and confirm it has no unwanted lettering, visible manufacturer marks, or inconsistent core vehicle proportions.

### Task 2: Implement the responsive Astro landing page

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Modify: `public/favicon.svg`

**Interfaces:**
- Consumes: the curated assets from Task 1.
- Produces: `/` as a semantic Portuguese page with hero, design, engineering, model collection, and private invitation sections.

- [x] Update document language, title, description, theme color, and existing layout defaults for VANTAGE.
- [x] Replace the Astro welcome page with the approved editorial story and original images; set image alt text, dimensions/aspect ratios, eager hero loading, and lazy loading below the fold.
- [x] Add same-page navigation and CTA anchors; ensure every interactive element has visible focus and touch targets.
- [x] Add a small requestAnimationFrame scroll handler that only updates the hero/detail image `transform`; skip work when reduced motion is requested or the image is offscreen. On mobile it continues at a reduced 8px amplitude to honor the parallax request.
- [x] Replace the Astro starter favicon with a simple VANTAGE monogram; stop linking the default Astro `.ico` favicon.
- [x] Add CSS for the charcoal/titanium palette, Instrument Serif and Manrope, fluid typography, asymmetric desktop compositions, mobile crops, and reduced-motion behavior.

**Check:** Review the rendered route at desktop and phone widths; confirm parallax tracks scroll gently, the reduced-motion mode stays static, the CTA reaches the final section, and no horizontal overflow appears.

### Task 3: Refine and validate delivery

**Files:**
- Modify: `src/pages/index.astro` or `src/layouts/Layout.astro` only where visual/accessibility review finds an issue.

**Interfaces:**
- Consumes: the completed `/` page and generated assets from Tasks 1–2.
- Produces: a clean production build and a verified desktop/mobile presentation.

- [x] Start the development server using the repository instruction `astro dev --background`.
- [ ] Inspect desktop and mobile browser viewports, including reduced motion; fix crop, type wrapping, contrast, focus, and overflow issues found. Desktop was reviewed in the connected browser. A mobile viewport could not be configured because the connected browser API exposes no viewport control and Playwright is not installed.
- [x] Run `npm run build` from the Astro project root and confirm it completes successfully.
- [x] Stop the background server with `astro dev stop` after browser review.
