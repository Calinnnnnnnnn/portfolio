import React, { useEffect, useRef } from "react";
import { Linkedin, Instagram, Github } from "lucide-react";
import styles from "./ContactIntro.module.css";

export default function ContactIntro() {
  const introRef = useRef(null);
  const bgRef = useRef(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    const section = introRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    // 1) KILL ZOOM (desktop + mobil + reduce-motion)
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    section.dataset.nozoom = "true";            // pentru CSS override
    bg.style.transform = "none";
    bg.style.willChange = "auto";
    bg.style.transition = "none";

    // 2) REVEAL-ONCE (fără scroll listener)
    const lines = section.querySelectorAll(`.${styles.revealText}`);
    if (!lines.length) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || isMobile || prefersReducedMotion) {
        lines.forEach(el => el.style.setProperty("--reveal", "100%"));
        section.dataset.revealed = "true";
        io.disconnect();
      }
    }, { threshold: 0.35 });

    io.observe(section);
    return () => io.disconnect();
  }, []);


  return (
    <section ref={introRef} className={styles.intro} aria-label="Contact intro">
      <div ref={bgRef} className={styles.background} /> {/* fundal cu zoom controlat din JS */}
      <div className={styles.maskTop} />
      <div className={styles.maskBottom} />

      <div className={styles.content}>
        <h2 className={styles.revealWrap}>
          <span className={styles.ghost}>Build it. Ship it. Make it matter.</span>
          <span className={styles.revealText}>Build it. Ship it. Make it matter.</span>
        </h2>
        <h2 className={styles.revealWrap}>
          <span className={styles.ghost}>From idea to production, end-to-end.</span>
          <span className={styles.revealText}>From idea to production, end-to-end.</span>
        </h2>
        <h2 className={styles.revealWrap}>
          <span className={styles.ghost}>Ready when you are — let’s talk.</span>
          <span className={styles.revealText}>Ready when you are — let’s talk.</span>
        </h2>

        {/* === Social Media Icons === */}
        <div className={styles.socialIcons} aria-label="Social links">
          <a
            href="https://www.linkedin.com/in/ioan-calin-ilie-19a4552a9/?profileId=ACoAAEpId8YB6EZ8wePhiVLJDxuy1i7GRDBoqWo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin />
          </a>
          <a
            href="https://www.instagram.com/calin.ilie/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <Instagram />
          </a>
          <a
            href="https://github.com/Calinnnnnnnnn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github />
          </a>
        </div>
      </div>
    </section>
  );
}
