"use client";

import styles from "@/styles/ProjectSection.module.css";

interface ProjectSectionProps {
  name: string;
  description: string;
  tech: string;
  metric: string;
  link: string;
  index: number;
  total: number;
  color: string;
}

export default function ProjectSection({
  name,
  description,
  tech,
  metric,
  link,
  index,
  total,
  color,
}: ProjectSectionProps) {
  return (
    <div className={styles.project} data-project-index={index}>
      <div className={styles.topBar}>
        <h2 className={styles.projectName}>{name}</h2>
        <span className={styles.counter}>
          {String(index + 1).padStart(2, "0")}/
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className={styles.imageWrapper}>
        {/* Placeholder with gradient — replace with actual screenshots */}
        <div
          className={styles.projectImage}
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: 700,
            color: color,
            opacity: 0.6,
          }}
        >
          {name}
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.description}>{description}</p>
        <p className={styles.techStack}>Tech: {tech}</p>
        <p className={styles.metric}>{metric}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewLink}
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  );
}
