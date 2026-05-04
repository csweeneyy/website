
// Global Cursor Logic
(function() {
  if (window.cursorInitialized) return;
  window.cursorInitialized = true;

  // Create cursor elements if they don't exist
  let crossV = document.getElementById('crosshair-v');
  let crossH = document.getElementById('crosshair-h');
  if (!crossV) {
    crossV = document.createElement('div');
    crossV.id = 'crosshair-v';
    crossV.className = 'crosshair crosshair--v';
    document.body.appendChild(crossV);
  }
  if (!crossH) {
    crossH = document.createElement('div');
    crossH.id = 'crosshair-h';
    crossH.className = 'crosshair crosshair--h';
    document.body.appendChild(crossH);
  }

  let isTicking = false;
  document.addEventListener("mousemove", (e) => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        crossV.style.left = e.clientX + "px";
        crossH.style.top  = e.clientY + "px";
        isTicking = false;
      });
      isTicking = true;
    }
  });

  document.addEventListener("mouseenter", () => document.body.classList.remove("cursor-gone"));
  document.addEventListener("mouseleave", () => document.body.classList.add("cursor-gone"));
})();
