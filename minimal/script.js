/* ═══════════════════════════════════════════════════════
   MINIMAL PORTFOLIO v4 — Animation Orchestrator
   Phase 1: White panels collapse to center
   Phase 2: Name reveal letter-by-letter + font cycling + nav slide-in
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
  // Set a random font IMMEDIATELY — no delay/pause on the final font
  el.style.fontFamily = `"${CYCLE_FONTS[Math.floor(Math.random() * CYCLE_FONTS.length)]}", serif`;

  const startTime = Date.now();
  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      clearInterval(timer);
      el.style.fontFamily = `"${FINAL_FONT}", serif`;
      return;
    }
    const randomFont = CYCLE_FONTS[Math.floor(Math.random() * CYCLE_FONTS.length)];
    el.style.fontFamily = `"${randomFont}", serif`;
  }, interval);
}

function initHome() {
  const loader     = document.getElementById("loader");
  const panelTop   = document.getElementById("panel-top");
  const panelBot   = document.getElementById("panel-bot");
  const crossV     = document.getElementById("crosshair-v");
  const crossH     = document.getElementById("crosshair-h");
  const navLinks   = document.querySelectorAll(".nav-link");
  const revealChars = document.querySelectorAll(".hero__name [data-reveal]");
  const cards       = document.querySelectorAll(".card");
  const tagline     = document.querySelector(".hero__tagline");
  const heroBio     = document.querySelector(".hero__bio");

  // All hero characters (including C and S) for font cycling
  const allHeroChars = document.querySelectorAll(".hero__char");



  // ── Session gate ──
  if (sessionStorage.getItem("cs-loaded")) {
    document.body.classList.add("skip-loader");
    return;
  }
  sessionStorage.setItem("cs-loaded", "1");

  // Pre-set random fonts on all hero chars so Melodrame is never visible before cycling
  // Start cycling IMMEDIATELY — runs during the loader so it's already going when revealed
  const baseCycleDuration = 1800;  // long enough to cover loader + reveal
  const staggerDelay = 60;

  allHeroChars.forEach((char, i) => {
    const cycleDuration = baseCycleDuration + i * staggerDelay;
    cycleFonts(char, cycleDuration, 50);
  });

  // ── PHASE 1: White panels collapse to center ──
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panelTop.style.transition = "height 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
      panelBot.style.transition = "height 0.5s cubic-bezier(0.65, 0, 0.35, 1)";
      panelTop.style.height = "50%";
      panelBot.style.height = "50%";
    });
  });

  // ── PHASE 2: Loader out + reveal content ──
  setTimeout(() => {
    // Hide loader
    loader.style.transition = "opacity 0.3s ease";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.classList.add("is-done");

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

    }, 350); // after loader fades
  }, 700); // faster — panels close in 0.5s so 700ms is enough
}

// Run immediately if DOM is already parsed (Swup navigation), otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}
