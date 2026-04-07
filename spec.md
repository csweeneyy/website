# Portfolio Site Build Spec v3 — Connor Sweeney
## Scroll-Driven Interactive Portfolio

---

## Overview

A single-page, scroll-driven portfolio site with cinematic transitions. The entire experience is controlled by scroll position — sections pin in place while animations play out, then release to the next section.

**Core tech:** Next.js (App Router) + GSAP ScrollTrigger + CSS

**Reference sites for scroll feel:**
- Kestrix (kestrix.io) — scroll-driven 3D house rotation with pinned sections
- Apple product pages (apple.com/macbook-pro) — scroll-scrubbed animations, pinned hero sections
- Netflix "N" intro — color spectrum expanding laterally from vertical strokes

---

## The Experience (Section by Section)

### SECTION 0: Loading Screen
**What the user sees:** A brief loading animation (1.5 seconds), then it transitions into the hero. Only shown **once per session** — subsequent visits/refreshes skip straight to the hero.

**Implementation:**
- On mount, check `sessionStorage.getItem('hasLoaded')`. If set, skip directly to hero.
- Animation: the name "Connor Sweeney" fades in letter by letter (staggered, 30ms per character), holds for 400ms, then the entire loading overlay slides up with `ease: "power2.inOut"` to reveal Section 1.
- After animation completes, set `sessionStorage.setItem('hasLoaded', 'true')`.
- Use a GSAP timeline (not scroll-driven — this plays automatically on mount).
- The loading screen is a fixed overlay (`position: fixed; inset: 0; z-index: 9999`) that sits above everything.

---

### SECTION 1: Name + Projects Hero
**What the user sees:** "Connor Sweeney" in large, bold type centered on screen. Four small project preview thumbnails arranged in defined positions around the name. Dark background (#0A0A0A).

**Layout (exact positions):**
```
┌──────────────────────────────────────────┐
│                                          │
│   [VibeTicker]                           │  ← top-left: 8% from left, 25% from top
│                                          │
│              Connor Sweeney              │  ← centered vertically and horizontally
│                                          │
│                               [Swell]    │  ← right-center: 75% from left, 45% from top
│   [ClipEngine]                           │  ← bottom-left: 12% from left, 65% from top
│                                          │
│          scroll to explore ↓             │  ← centered, 85% from top, subtle pulse animation
└──────────────────────────────────────────┘
```

**Thumbnail specs:**
- Size: 160×100px with 8px border-radius
- Slightly desaturated by default (`filter: saturate(0.7) brightness(0.8)`)
- On hover: full saturation, slight scale(1.05), subtle box-shadow glow
- Each thumbnail has a small label below it (project name, 12px, 50% opacity)
- Position them using `position: absolute` with percentage-based coordinates as noted above

**Typography:**
- Font: **Outfit, weight 900**
- Name size: `clamp(48px, 9vw, 140px)`
- Color: white (#FAFAFA)
- Letter-spacing: `-0.02em` (tight, modern feel)
- The two N's in "Connor" need to be wrapped in `<span>` tags for position measurement (used in Section 2)

**"scroll to explore" indicator:**
- Text: 14px Outfit 400, 40% opacity
- Includes a small animated chevron/arrow below it (CSS animation, oscillates 8px up/down, 2s loop)
- Fades out as user begins scrolling (tied to scroll position, gone by 100px of scroll)

---

### SECTION 2: NN Lines + Spectrum (Single Pinned Section)
**What the user sees:** As the user scrolls, three things happen in sequence within ONE continuous pinned section:
1. The name scrolls up and disappears. Two vertical lines — aligned with the right strokes of the N's — remain on screen.
2. The lines extend downward to full viewport height.
3. A color spectrum expands laterally from each line (Netflix N style), eventually filling the screen with a solid dark color.

This is a **single GSAP ScrollTrigger** with a phased timeline. No section handoff, no layout jump.

**Phase breakdown (mapped to scroll progress 0→1):**

| Progress | Phase | What happens |
|----------|-------|-------------|
| 0.00–0.15 | Name exit | Name translates up and fades out. Thumbnails fade out. Lines stay pinned at N-stroke positions. |
| 0.15–0.40 | Line extension | Two vertical lines grow from N-stroke height (~cap height) downward to full viewport height. |
| 0.40–0.75 | Spectrum expansion | Color gradient bands expand laterally outward from each line, filling the space between and beyond them. |
| 0.75–1.00 | Solid consolidation | The rainbow gradient transitions to a solid dark background (#0A0A0A). |

**The N-stroke line alignment:**
- Use Approach A: absolutely-positioned `<div>` elements overlaid on the N strokes.
- After the hero renders, measure the two N `<span>` elements with `getBoundingClientRect()`.
- The line X position = right edge of each N span minus the stroke width.
- Stroke width = render a hidden "I" character in the same font/size, measure its width. That's the stem width.
- Line color: same as text (#FAFAFA).
- Recalculate positions on window resize using `ResizeObserver` + `ScrollTrigger.refresh()`.

**GSAP setup:**
```javascript
const tl = gsap.timeline();

// Phase 1: Name exits
tl.to('.hero-name', { yPercent: -120, opacity: 0, duration: 0.15 })
  .to('.hero-thumbnails', { opacity: 0, duration: 0.1 }, '<')

// Phase 2: Lines extend
  .to('.nn-line', { height: '100vh', duration: 0.25 })

// Phase 3: Spectrum expands
  .fromTo('.spectrum-left',  { width: 0 }, { width: '55vw', duration: 0.35 })
  .fromTo('.spectrum-right', { width: 0 }, { width: '55vw', duration: 0.35 }, '<')

// Phase 4: Consolidate to solid
  .to('.spectrum-overlay', { opacity: 0, duration: 0.25 })
  .to('.solid-bg',         { opacity: 1, duration: 0.25 }, '<');

ScrollTrigger.create({
  trigger: '#section-nn-spectrum',
  start: 'top top',
  end: '+=350%',   // 3.5x viewport height of scroll distance
  pin: true,
  scrub: 1,
  animation: tl,
});
```

**Spectrum gradient:**
```css
.spectrum-band {
  background: linear-gradient(
    90deg,
    #7B6EF6, #3ECFB4, #A3E635, #F59E0B, #EF4444
  );
}
```

**The spectrum elements:**
- Two `<div>` elements, one anchored at each line's X position
- `.spectrum-left` expands leftward (`right` edge anchored to left line position, width grows)
- `.spectrum-right` expands rightward (`left` edge anchored to right line position, width grows)
- They overlap in the middle, which is fine — the visual result is a full-screen gradient sweep

---

### SECTION 3: Project Pages
**What the user sees:** Full-screen project showcases, one at a time. Each project gets its own viewport-height pinned area. The current project animates out while the next animates in.

**Implementation: GSAP pinned transitions (not snap scroll)**
Each project section is pinned. As the user scrolls:
- Current project image + text slides left and fades out
- Next project image + text slides in from right and fades in
- Transition duration: ~20% of each project's scroll range

**Layout per project:**
```
┌─────────────────────────────────────┐
│                                     │
│   PROJECT NAME              01/03   │  ← top bar: name left, counter right
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │     [FULL-WIDTH SCREENSHOT  │   │  ← 16:9 aspect ratio, max-width 900px
│   │      OR MOCKUP IMAGE]       │   │     centered, 8px border-radius
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   One-line description              │  ← 18px Outfit 400, 70% opacity
│   Tech: React, Python, FastAPI      │  ← 14px Outfit 400, 40% opacity
│   Key metric: 300+ users            │  ← 14px Outfit 500, accent color
│                                     │
│   [View Project →]                  │  ← text link, underline on hover
│                                     │
└─────────────────────────────────────┘
```

**Projects:**

1. **VibeTicker** — Reddit sentiment analysis for stock trading.
   - Description: "Real-time Reddit sentiment analysis for smarter stock trading decisions"
   - Tech: React, Python, FastAPI, Reddit API
   - Metric: "300+ active users"
   - Link: [URL]

2. **Swell** — Market intelligence across Reddit.
   - Description: "AI-powered market intelligence across 170k+ subreddit communities"
   - Tech: React, Python, NLP, Data Pipeline
   - Metric: "170k+ subreddits analyzed"
   - Link: [URL]

3. **ClipEngine** — Automated short-form video pipeline.
   - Description: "Automated short-form video distribution from long-form content"
   - Tech: Python, FFmpeg, ML Scene Detection
   - Metric: "End-to-end automated pipeline"
   - Link: [URL]

**Project images:** Use actual screenshots or mockups. Generate placeholder images during build if screenshots aren't available yet.

---

### SECTION 4: About
**What the user sees:** A brief, two-line bio section that establishes credibility. Appears between projects and contact.

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│   About                             │  ← 14px Outfit 500, 40% opacity, uppercase
│                                     │
│   I'm Connor — I build AI systems   │  ← 32px Outfit 700, white
│   that automate entire business     │
│   workflows. From NLP pipelines     │
│   to real-time data platforms,      │
│   I ship products that scale.       │
│                                     │
│   Based in [Location].              │  ← 18px Outfit 400, 60% opacity
│   Currently open to freelance       │
│   and contract work.                │
│                                     │
└─────────────────────────────────────┘
```

- Max-width: 640px, centered
- Fades in on scroll (simple GSAP `from` with `opacity: 0, y: 40`)
- Not pinned — normal scroll flow

---

### SECTION 5: Contact / CTA
**What the user sees:** Final section with contact info and social links.

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│        Let's work together.         │  ← 48px Outfit 800, white
│                                     │
│        [Get in touch →]             │  ← button: pill shape, accent bg (#7B6EF6)
│                                     │       hover: lighten 10%, scale(1.03)
│                                     │
│   ─────────────────────────         │  ← 1px line, 15% opacity
│                                     │
│   X · LinkedIn · GitHub             │  ← icon links, 20px, 50% opacity
│                                     │     hover: 100% opacity, accent color
│                                     │
│   © 2026 Connor Sweeney             │  ← 12px, 30% opacity
│                                     │
└─────────────────────────────────────┘
```

- "Get in touch" links to `mailto:` [your email]
- Social links open in new tabs
- Simple fade-in-on-scroll animation (same as About section)

---

## Technical Implementation

### Stack
```
Framework:    Next.js 14+ (App Router, TypeScript)
Animation:    GSAP 3 + ScrollTrigger (free for personal use)
Styling:      CSS Modules (no Tailwind — vanilla CSS for full control)
Font:         Outfit (Google Fonts) — weights 400, 500, 700, 800, 900
Deployment:   Vercel
```

### File Structure
```
src/
  app/
    page.tsx              ← main page, orchestrates all sections
    layout.tsx            ← font imports (Outfit), metadata, global styles
    globals.css           ← CSS reset, dark theme, typography tokens, shared styles
  components/
    LoadingScreen.tsx     ← auto-play intro animation, sessionStorage gate
    HeroSection.tsx       ← name + positioned thumbnails + scroll indicator
    NNSpectrumSection.tsx ← merged NN lines + spectrum expansion (single pinned timeline)
    ProjectSection.tsx    ← single project slide (reused 3x)
    ProjectsContainer.tsx ← wraps all project slides, handles pinned transitions
    AboutSection.tsx      ← brief bio with scroll fade-in
    ContactSection.tsx    ← CTA, social links, footer
  hooks/
    useGSAP.ts            ← GSAP + ScrollTrigger registration, cleanup helper
  styles/
    LoadingScreen.module.css
    HeroSection.module.css
    NNSpectrumSection.module.css
    ProjectSection.module.css
    AboutSection.module.css
    ContactSection.module.css
```

### Responsive Strategy

| Breakpoint | Behavior |
|-----------|----------|
| > 1024px (desktop) | Full experience as described above |
| 768–1024px (tablet) | Reduce name size, keep NN transition but with recalculated positions |
| < 768px (mobile) | Skip NN line transition entirely — name fades out, crossfades to solid dark bg. Projects stack vertically with simple fade-in. |

**Implementation:**
- Use `ResizeObserver` on the hero name container to recalculate N-stroke positions on resize
- Call `ScrollTrigger.refresh()` after recalculation
- Use a `useMediaQuery` hook or CSS media queries to conditionally simplify animations on mobile
- All section heights and spacings use `vh`/`vw` units or `clamp()` for fluid scaling

---

## Page Structure (Scroll Height Map)

```
What the page actually looks like (DOM height):
┌──────────────┐
│ Loading      │  Fixed overlay (not in scroll flow)
├──────────────┤
│ Section 1    │  100vh (hero, natural scroll)
│ (hero)       │
├──────────────┤
│              │
│ Section 2    │  450vh (pinned for 350% — NN lines + spectrum)
│ (NN+spectrum)│  User scrolls through 3.5 viewport heights
│              │  while section stays fixed
│              │
├──────────────┤
│ Section 3    │  400vh (3 projects × ~130vh each, pinned transitions)
│ (projects)   │
├──────────────┤
│ Section 4    │  80vh (about, normal scroll)
│ (about)      │
├──────────────┤
│ Section 5    │  60vh (contact/CTA, normal scroll)
│ (contact)    │
└──────────────┘
Total: ~1,090vh of scroll distance
User sees: 100vh viewport at any moment
```

---

## Priority Order

1. ~~Get GSAP ScrollTrigger working with a basic pinned section~~ → scaffold project + get a single pinned section changing color on scroll
2. Build hero section with name + thumbnail positions
3. Implement NN lines + spectrum as single pinned timeline
4. Build project pages with pinned transitions
5. Add about section
6. Add contact section
7. Add loading screen (with sessionStorage gate)
8. Responsive: mobile simplification, tablet adjustments
9. Polish: timing, easing, colors, hover states
10. Deploy to Vercel