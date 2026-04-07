"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import styles from "@/styles/ContactSection.module.css";

const SOCIALS = [
  { name: "X", href: "https://x.com/" },
  { name: "LinkedIn", href: "https://linkedin.com/in/" },
  { name: "GitHub", href: "https://github.com/" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.from(contentRef.current!.children, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="contact">
      <div ref={contentRef}>
        <h2 className={styles.heading}>Let&apos;s work together.</h2>

        <a href="mailto:hello@connorsweeney.dev" className={styles.ctaButton}>
          Get in touch →
        </a>

        <div className={styles.divider} />

        <div className={styles.socials}>
          {SOCIALS.map((social, i) => (
            <span key={social.name} style={{ display: "contents" }}>
              {i > 0 && <span className={styles.socialDot} />}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {social.name}
              </a>
            </span>
          ))}
        </div>

        <p className={styles.copyright}>© 2026 Connor Sweeney</p>
      </div>
    </section>
  );
}
