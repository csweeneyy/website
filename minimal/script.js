/* ═══════════════════════════════════════════════════════
   MINIMAL PORTFOLIO — Interactive Effects
   ═══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  // ---- Mouse-follow chrome shine on cards ----
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Move the shine gradient origin to follow cursor
      const shine = card.querySelector(".card__shine");
      if (shine) {
        shine.style.background = `
          radial-gradient(
            ellipse at ${x}% ${y}%,
            rgba(220, 230, 255, 0.18) 0%,
            transparent 50%
          )
        `;
        shine.style.opacity = "1";
      }

      // Subtle tilt
      const tiltX = ((y - 50) / 50) * -3;
      const tiltY = ((x - 50) / 50) * 3;
      card.style.transform = `
        perspective(800px) 
        rotateX(${tiltX}deg) 
        rotateY(${tiltY}deg) 
        translateY(-4px) 
        scale(1.015)
      `;
    });

    card.addEventListener("mouseleave", () => {
      const shine = card.querySelector(".card__shine");
      if (shine) {
        shine.style.opacity = "0";
      }
      card.style.transform = "";
    });
  });
});
