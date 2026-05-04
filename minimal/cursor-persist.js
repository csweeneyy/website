(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const crossV = document.getElementById("crosshair-v");
    const crossH = document.getElementById("crosshair-h");
    if (!crossV || !crossH) return;

    // Restore cursor immediately on load
    const lastX = sessionStorage.getItem("cs-cursorX");
    const lastY = sessionStorage.getItem("cs-cursorY");
    if (lastX && lastY) {
      // Temporarily disable transition so it doesn't animate from 0,0
      crossV.style.transition = "none";
      crossH.style.transition = "none";
      crossV.style.left = lastX;
      crossH.style.top = lastY;
      
      // Force repaint to apply the non-transitioned position
      crossV.offsetHeight; 
      
      // Restore the CSS transition
      crossV.style.transition = "";
      crossH.style.transition = "";
    }

    // Save cursor right before leaving
    window.addEventListener("pagehide", () => {
      sessionStorage.setItem("cs-cursorX", crossV.style.left);
      sessionStorage.setItem("cs-cursorY", crossH.style.top);
    });
  });
})();
