"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import styles from "@/styles/AboutSection.module.css";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.from(contentRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="about">
      <div ref={contentRef} className={styles.content}>
        <span className={styles.label}>About</span>
        <p className={styles.bio}>
          I&apos;m Connor — I build AI systems that automate entire business
          workflows. From NLP pipelines to real-time data platforms, I ship
          products that scale.
        </p>
        <p className={styles.details}>
          Currently open to freelance and contract work.
        </p>
      </div>
    </section>
  );
}
