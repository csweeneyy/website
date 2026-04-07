"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import styles from "@/styles/LoadingScreen.module.css";

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Skip if already loaded this session
    if (sessionStorage.getItem("hasLoaded")) {
      setShow(false);
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    const letters = overlay.querySelectorAll(`.${styles.letter}`);
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("hasLoaded", "true");
        setShow(false);
      },
    });

    // Stagger fade in each letter
    tl.to(letters, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.03,
      ease: "none",
    })
      // Hold
      .to({}, { duration: 0.4 })
      // Slide overlay up
      .to(overlay, {
        yPercent: -100,
        duration: 0.8,
        ease: "power2.inOut",
      });
  }, []);

  if (!show) return null;

  const firstName = "Connor";
  const lastName = "Sweeney";

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.text}>
        <span>
          {firstName.split("").map((char, i) => (
            <span key={`f-${i}`} className={styles.letter}>
              {char}
            </span>
          ))}
        </span>
        <span>
          {lastName.split("").map((char, i) => (
            <span key={`l-${i}`} className={styles.letter}>
              {char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
