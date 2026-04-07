/* ═══════════════════════════════════════════════════════
   MINIMAL PORTFOLIO v2 — Crosshair + Loader
   ═══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const crossV = document.getElementById("crosshair-v");
  const crossH = document.getElementById("crosshair-h");

  // ---- Loader ----
  const hasSeenLoader = sessionStorage.getItem("cs-loaded");

  if (hasSeenLoader) {
    // Skip loader entirely
    document.body.classList.add("skip-loader");
  } else {
    // Show loader, then transition out
    sessionStorage.setItem("cs-loaded", "1");

    setTimeout(() => {
      // Start exit animation
      if (loader) loader.classList.add("is-leaving");

      // After exit transition, reveal content
      setTimeout(() => {
        if (loader) loader.classList.add("is-hidden");
        document.body.classList.add("loaded");
      }, 600);
    }, 1600); // Hold loader for 1.6s (enough for draw-in + brief hold)
  }

  // ---- Crosshair cursor ----
  if (crossV && crossH) {
    document.addEventListener("mousemove", (e) => {
      crossV.style.left = e.clientX + "px";
      crossH.style.top = e.clientY + "px";
    });

    document.addEventListener("mouseenter", () => {
      document.body.classList.remove("cursor-gone");
    });

    document.addEventListener("mouseleave", () => {
      document.body.classList.add("cursor-gone");
    });
  }
});
