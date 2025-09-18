import React from "react";
import { Linkedin, Instagram, Github } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} Ilie Ioan-Călin. All rights reserved.
        </p>

        <nav className={styles.social} aria-label="Rețele sociale">
          <a
            className={styles.iconLink}
            href="https://www.linkedin.com/in/ioan-calin-ilie-19a4552a9/?profileId=ACoAAEpId8YB6EZ8wePhiVLJDxuy1i7GRDBoqWo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin className={styles.icon} />
          </a>

          <a
            className={styles.iconLink}
            href="https://www.instagram.com/calin.ilie/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <Instagram className={styles.icon} />
          </a>

          <a
            className={styles.iconLink}
            href="https://github.com/Calinnnnnnnnn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className={styles.icon} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
