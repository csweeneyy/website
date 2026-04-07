"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { useMediaQuery } from "@/hooks/useGSAP";
import styles from "@/styles/NNSpectrumSection.module.css";

export default function NNSpectrumSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroCloneRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const heroThumbsRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<HTMLDivElement>(null);
  const solidBgRef = useRef<HTMLDivElement>(null);
  const strokeMeasureRef = useRef<HTMLSpanElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [linePositions, setLinePositions] = useState<{
    left: number;
    right: number;
    strokeWidth: number;
    topOffset: number;
    capHeight: number;
  } | null>(null);

  // Measure N positions
  const measurePositions = useCallback(() => {
    if (isMobile || !heroNameRef.current || !sectionRef.current) return;

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const nSpans = heroNameRef.current.querySelectorAll("[data-n]");

    if (nSpans.length < 2) return;

    const n1Rect = nSpans[0].getBoundingClientRect();
    const n2Rect = nSpans[1].getBoundingClientRect();

    let strokeWidth = 12;
    if (strokeMeasureRef.current) {
      strokeWidth = strokeMeasureRef.current.getBoundingClientRect().width;
    }

    const left = n1Rect.right - sectionRect.left - strokeWidth;
    const right = n2Rect.right - sectionRect.left - strokeWidth;
    const capHeight = n1Rect.height;
    const topOffset = n1Rect.top - sectionRect.top;

    setLinePositions({ left, right, strokeWidth, topOffset, capHeight });
  }, [isMobile]);

  useEffect(() => {
    measurePositions();

    const ro = new ResizeObserver(() => {
      measurePositions();
    });

    if (sectionRef.current) {
      ro.observe(sectionRef.current);
    }

    return () => ro.disconnect();
  }, [measurePositions]);

  // FIRST: Create pin immediately on mount to claim space in layout.
  // This prevents the race condition with ProjectsContainer's pin.
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();
    const endAmount = isMobile ? "+=150%" : "+=350%";

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: endAmount,
      pin: true,
      scrub: 1,
      animation: tl,
    });

    stRef.current = st;
    tlRef.current = tl;

    // Refresh all other ScrollTriggers after this pin is established
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => {
      st.kill();
      tl.kill();
      stRef.current = null;
      tlRef.current = null;
    };
    // Only run on initial mount + mobile change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // SECOND: Populate the timeline with animation phases once measurements are ready.
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl || !heroCloneRef.current || !solidBgRef.current) return;

    // Clear any previous tweens on the timeline
    tl.clear();

    if (isMobile) {
      tl.to(heroCloneRef.current, { opacity: 0, duration: 0.5 })
        .to(solidBgRef.current, { opacity: 1, duration: 0.5 }, "<0.2");
    } else {
      if (
        !linePositions ||
        !lineLeftRef.current ||
        !lineRightRef.current ||
        !spectrumRef.current
      ) {
        // Lines not rendered yet — just do name exit
        tl.to(
          heroCloneRef.current,
          { yPercent: -120, opacity: 0, duration: 0.15 },
          0
        );
        return;
      }

      // Phase 1: Name exits (0 → 0.15)
      tl.to(
        heroCloneRef.current,
        { yPercent: -120, opacity: 0, duration: 0.15 },
        0
      ).to(heroThumbsRef.current, { opacity: 0, duration: 0.1 }, 0);

      // Phase 2: Lines extend full viewport height (0.15 → 0.40)
      tl.to(
        [lineLeftRef.current, lineRightRef.current],
        { height: "100vh", duration: 0.25, ease: "power1.inOut" },
        0.15
      );

      // Phase 3: Spectrum scales from 0 to full width (0.40 → 0.75)
      tl.to(
        spectrumRef.current,
        { scaleX: 1, duration: 0.35, ease: "power2.out" },
        0.4
      );

      // Phase 4: Consolidate to solid dark (0.75 → 1.0)
      tl.to(
        [spectrumRef.current, lineLeftRef.current, lineRightRef.current],
        { opacity: 0, duration: 0.15 },
        0.75
      ).to(solidBgRef.current, { opacity: 1, duration: 0.25 }, 0.75);
    }
  }, [isMobile, linePositions]);

  return (
    <div ref={sectionRef} className={styles.section} id="section-nn-spectrum">
      {/* Hidden stroke width measurement */}
      <span
        ref={strokeMeasureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          fontSize: "clamp(48px, 9vw, 140px)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          fontFamily: "var(--font-outfit)",
        }}
      >
        I
      </span>

      {/* Clone of hero content for animation continuity */}
      <div ref={heroCloneRef} className={styles.heroClone}>
        <h1
          ref={heroNameRef}
          className={styles.heroName}
          aria-hidden="true"
        >
          Co
          <span data-n="1">n</span>
          <span data-n="2">n</span>
          or Sweeney
        </h1>
      </div>

      {/* Thumbnail clones (for fade out) */}
      <div ref={heroThumbsRef} className={styles.heroThumbnails} />

      {/* NN Lines */}
      {!isMobile && linePositions && (
        <>
          <div
            ref={lineLeftRef}
            className={styles.nnLine}
            style={{
              left: linePositions.left,
              top: linePositions.topOffset,
              width: linePositions.strokeWidth,
              height: linePositions.capHeight,
            }}
          />
          <div
            ref={lineRightRef}
            className={styles.nnLine}
            style={{
              left: linePositions.right,
              top: linePositions.topOffset,
              width: linePositions.strokeWidth,
              height: linePositions.capHeight,
            }}
          />
        </>
      )}

      {/* Spectrum overlay */}
      <div ref={spectrumRef} className={styles.spectrumOverlay} />

      {/* Solid background overlay */}
      <div ref={solidBgRef} className={styles.solidBg} />
    </div>
  );
}
