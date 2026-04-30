/* ═══════════════════════════════════════════════════════
   MINIMAL PORTFOLIO v3 — C/S Animation Orchestrator
   Phase 1: C from bottom, S from right → vertical alignment
   Phase 2: White panels slide in, letters invert
   Phase 3: Name reveal letter-by-letter + font cycling + nav slide-in
   ═══════════════════════════════════════════════════════ */

// ── Fonts to cycle through (must match @font-face names in style.css) ──
const CYCLE_FONTS = [
  "Acne", "Aero", "Akira", "AppleGaramond", "AstralDelight",
  "Cinzel", "CinzelDeco", "DSDigi", "DreamMMA", "LEDLight",
  "MontHeavy", "Nasalization", "OverThere", "VerminVibes",
  "Vogue", "Worldstar", "Cubic", "Paterna",
];
const FINAL_FONT = "Melodrame";

/**
 * Cycle a single element's font-family rapidly, then settle on the final font.
 * @param {HTMLElement} el — the character span
 * @param {number} duration — total cycling time in ms
 * @param {number} interval — ms between font switches
 */
function cycleFonts(el, duration, interval = 50) {
  const startTime = Date.now();
  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      clearInterval(timer);
      el.style.fontFamily = `"${FINAL_FONT}", serif`;
      return;
    }
    // Pick a random font
    const randomFont = CYCLE_FONTS[Math.floor(Math.random() * CYCLE_FONTS.length)];
    el.style.fontFamily = `"${randomFont}", serif`;
  }, interval);
}

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

  // All hero characters (including C and S) for font cycling
  const allHeroChars = document.querySelectorAll(".hero__char");

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
  const targetCx = cRect.left;
  const targetCy = cRect.top;
  const targetSx = sRect.left;
  const targetSy = sRect.top;

  // Starting positions
  letterC.style.left = targetCx + "px";
  letterC.style.top  = (vh + 80) + "px";
  letterS.style.left = (vw + 80) + "px";
  letterS.style.top  = targetSy + "px";

  // Smooth transitions
  const moveT = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";

  // Animate to final vertical position
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      letterC.style.transition = moveT;
      letterS.style.transition = moveT;

      letterC.style.top = targetCy + "px";
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

  // ── PHASE 3: Loader out + reveal content + font cycling ──
  setTimeout(() => {
    // Hide loader
    loader.style.transition = "opacity 0.4s ease";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.classList.add("is-done");

      // ── Font cycling on all hero characters ──
      // Each letter gets a staggered cycle duration so they settle one by one
      const baseCycleDuration = 800;
      const staggerDelay = 60;

      allHeroChars.forEach((char, i) => {
        const cycleDuration = baseCycleDuration + i * staggerDelay;
        cycleFonts(char, cycleDuration, 50);
      });

      // Reveal remaining characters letter-by-letter
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
