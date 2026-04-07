"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { useMediaQuery } from "@/hooks/useGSAP";
import ProjectSection from "./ProjectSection";
import styles from "@/styles/ProjectsContainer.module.css";

const PROJECTS = [
  {
    name: "VibeTicker",
    description:
      "Real-time Reddit sentiment analysis for smarter stock trading decisions",
    tech: "React, Python, FastAPI, Reddit API",
    metric: "300+ active users",
    link: "#",
    color: "#7B6EF6",
  },
  {
    name: "Swell",
    description:
      "AI-powered market intelligence across 170k+ subreddit communities",
    tech: "React, Python, NLP, Data Pipeline",
    metric: "170k+ subreddits analyzed",
    link: "#",
    color: "#3ECFB4",
  },
  {
    name: "ClipEngine",
    description:
      "Automated short-form video distribution from long-form content",
    tech: "Python, FFmpeg, ML Scene Detection",
    metric: "End-to-end automated pipeline",
    link: "#",
    color: "#F59E0B",
  },
];

export default function ProjectsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!containerRef.current || isMobile) return;
    gsap.registerPlugin(ScrollTrigger);

    const projects = containerRef.current.querySelectorAll("[data-project-index]");
    const numProjects = projects.length;
    if (numProjects === 0) return;

    // Make first project visible
    gsap.set(projects[0], { opacity: 1, x: 0 });
    gsap.set(Array.from(projects).slice(1), { opacity: 0, x: "100%" });

    const tl = gsap.timeline();

    // Create transitions between projects
    for (let i = 0; i < numProjects - 1; i++) {
      // Current slides left and fades
      tl.to(projects[i], {
        x: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
      // Next slides in from right
      tl.fromTo(
        projects[i + 1],
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power2.inOut" },
        "<"
      );
      // Hold on each project
      if (i < numProjects - 2) {
        tl.to({}, { duration: 0.3 });
      }
    }

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${numProjects * 130}%`,
      pin: true,
      scrub: 1,
      animation: tl,
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, [isMobile]);

  if (isMobile) {
    // Mobile: simple stacked layout
    return (
      <div id="projects">
        {PROJECTS.map((project, i) => (
          <div
            key={project.name}
            style={{
              position: "relative",
              width: "100%",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              background: "var(--bg)",
            }}
          >
            <ProjectSection
              {...project}
              index={i}
              total={PROJECTS.length}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.container} id="projects">
      {PROJECTS.map((project, i) => (
        <ProjectSection
          key={project.name}
          {...project}
          index={i}
          total={PROJECTS.length}
        />
      ))}
    </div>
  );
}
