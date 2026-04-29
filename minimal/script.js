/* ═══════════════════════════════════════════════════════
   MINIMAL PORTFOLIO v3 — C/S Animation Orchestrator
   Phase 1: C from bottom, S from right → vertical alignment
   Phase 2: White panels slide in, letters invert
   Phase 3: Name reveal letter-by-letter + nav slide-in
   ═══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  const loader     = document.getElementById("loader");
  const panelTop   = document.getElementById("panel-top");
  const panelBot   = document.getElementById("panel-bot");
  const letterC    = document.getElementById("letter-c");
  const letterS    = document.getElementById("letter-s");
  const crossV     = document.getElementById("crosshair-v");
  const crossH     = document.getElementById("crosshair-h");
  const hero       = document.getElementById("hero");
  const navLinks   = document.querySelectorAll(".nav-link");
  const revealChars = document.querySelectorAll(".hero__char[data-reveal]");
  const cards       = document.querySelectorAll(".card");
  const tagline     = document.querySelector(".hero__tagline");
  const heroBio     = document.querySelector(".hero__bio");

  // ── Crosshair cursor ──
  if (crossV && crossH) {
    document.addEventListener("mousemove", (e) => {
      crossV.style.left = e.clientX + "px";
      crossH.style.top  = e.clientY + "px";
    });
    document.addEventListener("mouseenter", () => document.body.classList.remove("cursor-gone"));
    document.addEventListener("mouseleave", () => document.body.classList.add("cursor-gone"));
  }

  // ── Session gate ──
  if (sessionStorage.getItem("cs-loaded")) {
    document.body.classList.add("skip-loader");
    return;
  }
  sessionStorage.setItem("cs-loaded", "1");

  // ── Animation config ──
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Get final positions of C and S in the hero layout
  const heroCharC = document.querySelector(".hero__char--c");
  const heroCharS = document.querySelector(".hero__char--s");

  // Temporarily reveal chars for measurement
  revealChars.forEach(c => { c.style.opacity = "1"; c.style.transform = "none"; });
  const cRect = heroCharC.getBoundingClientRect();
  const sRect = heroCharS.getBoundingClientRect();
  revealChars.forEach(c => { c.style.opacity = "0"; c.style.transform = "translateY(20px)"; });

  // Loader letter size matches hero
  const fontSize = window.getComputedStyle(heroCharC).fontSize;
  letterC.style.fontSize = fontSize;
  letterS.style.fontSize = fontSize;

  // ── PHASE 1: Letters enter → already vertically aligned ──
  // C starts below viewport, S starts off-right
  // Both target the same x-position (left-aligned, stacked)
  const targetCx = cRect.left;
  const targetCy = cRect.top;
  const targetSx = sRect.left;
  const targetSy = sRect.top;

  // Starting positions (no diagonal — they go straight to vertical)
  letterC.style.left = targetCx + "px";
  letterC.style.top  = (vh + 80) + "px";    // below viewport
  letterS.style.left = (vw + 80) + "px";    // off-right
  letterS.style.top  = targetSy + "px";     // already at correct y

  // Smooth transitions
  const moveT = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";

  // Animate to final vertical position
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      letterC.style.transition = moveT;
      letterS.style.transition = moveT;

      // C slides up to its position
      letterC.style.top = targetCy + "px";
      // S slides left to its position
      letterS.style.left = targetSx + "px";
    });
  });

  // ── PHASE 2: Dark panels slide in (after letters settle) ──
  setTimeout(() => {
    panelTop.style.transition = "height 0.7s cubic-bezier(0.65, 0, 0.35, 1)";
    panelBot.style.transition = "height 0.7s cubic-bezier(0.65, 0, 0.35, 1)";
    panelTop.style.height = "50%";
    panelBot.style.height = "50%";

    // Flip letters to light as dark panels sweep over
    setTimeout(() => {
      letterC.style.color = "#EDF2EF";
      letterS.style.color = "#EDF2EF";
    }, 300);
  }, 1200);

  // ── PHASE 3: Loader out + reveal content ──
  setTimeout(() => {
    // Hide loader
    loader.style.transition = "opacity 0.4s ease";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.classList.add("is-done");

      // Reveal remaining characters letter-by-letter (SLOWER: 90ms stagger)
      revealChars.forEach((char, i) => {
        setTimeout(() => {
          char.style.transition = "opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
          char.style.opacity = "1";
          char.style.transform = "translateY(0)";
        }, i * 90);
      });

      // Tagline fade in after letters
      const letterDuration = revealChars.length * 90 + 200;
      setTimeout(() => {
        tagline.style.transition = "opacity 0.6s ease";
        tagline.style.opacity = "1";
      }, letterDuration);

      // Bio fade in after tagline
      setTimeout(() => {
        if (heroBio) {
          heroBio.style.transition = "opacity 0.8s ease";
          heroBio.style.opacity = "1";
        }
      }, letterDuration + 300);

      // Nav links slide in from right (staggered)
      navLinks.forEach((link, i) => {
        setTimeout(() => {
          link.style.transition = "opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
          link.style.opacity = "1";
          link.style.transform = "translateX(0)";
        }, i * 100);
      });

      // Video section fade in (or cards if on ventures)
      const videoSection = document.getElementById("video-section");
      if (videoSection) {
        setTimeout(() => {
          videoSection.style.transition = "opacity 0.8s ease";
          videoSection.style.opacity = "1";
        }, 300);
      }
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.transition = "opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 150 + i * 90);
      });

    }, 450); // after loader fades
  }, 2000);
});
