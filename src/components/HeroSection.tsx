"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import styles from "@/styles/HeroSection.module.css";

const PROJECTS = [
  { name: "VibeTicker", className: styles.thumb0 },
  { name: "Swell", className: styles.thumb1 },
  { name: "ClipEngine", className: styles.thumb2 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Fade out scroll indicator on first scroll
  useEffect(() => {
    if (!indicatorRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=100",
      onUpdate: (self) => {
        if (indicatorRef.current) {
          indicatorRef.current.style.opacity = String(1 - self.progress);
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      {/* Project thumbnails */}
      <div className={styles.thumbnails}>
        {PROJECTS.map((project, i) => (
          <div
            key={project.name}
            className={`${styles.thumbnail} ${project.className}`}
          >
            <div
              className={styles.thumbnailImage}
              style={{ background: `var(--bg-elevated)` }}
            />
            <span className={styles.thumbnailLabel}>{project.name}</span>
          </div>
        ))}
      </div>

      {/* Name */}
      <div className={styles.nameContainer}>
        <h1 className={styles.name}>
          Co
          <span className={styles.letterN} data-n="1">
            n
          </span>
          <span className={styles.letterN} data-n="2">
            n
          </span>
          or Sweeney
        </h1>
      </div>

      {/* Scroll indicator */}
      <div ref={indicatorRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>scroll to explore</span>
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
