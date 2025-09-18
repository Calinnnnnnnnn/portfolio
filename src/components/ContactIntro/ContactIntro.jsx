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

    // dacă s-a dezvăluit deja (ex. navigare înapoi), rămâne „lock”
    lockedRef.current = section.dataset.revealed === "true";

    const lines = section.querySelectorAll(`.${styles.revealText}`);
    if (!lines.length) return;

    const passive = { passive: true };
    let ticking = false;

    // tuning efecte (poți ajusta)
    const START_AT = 0.10;   // începe devreme
    const GAMMA    = 0.6;    // colorare mai rapidă la început
    const MIN_SCALE = 1.05;  // zoom inițial
    const MAX_SCALE = 1.20;  // zoom final (realist)

    const applyScale = (k) => {
      const s = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * k;
      bg.style.setProperty("--bg-scale", s.toFixed(4));
    };

    const update = () => {
      ticking = false;

      if (lockedRef.current) {
        lines.forEach(el => el.style.setProperty("--reveal", "100%"));
        applyScale(1);
        return;
      }

      const r = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;

      // cât din secțiune este vizibil efectiv (px)
      const visiblePx = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      // normalizăm la [0..1] față de cea mai mică dintre (vh, r.height)
      const visRatio = visiblePx / Math.min(vh, Math.max(1, r.height));

      // întârziere + ease-in
      const t = Math.max(0, (visRatio - START_AT) / (1 - START_AT)); // 0..1
      const eased = Math.pow(t, GAMMA); // 0..1, mai rapid la început

      // aplicăm reveal + micro-zoom
      const pct = Math.round(eased * 100);
      lines.forEach(el => el.style.setProperty("--reveal", `${pct}%`));
      applyScale(eased);

      if (pct >= 100) {
        section.dataset.revealed = "true";
        lockedRef.current = true;
        lines.forEach(el => el.style.setProperty("--reveal", "100%"));
        applyScale(1);
        window.removeEventListener("scroll", onScroll, passive);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // init (setează starea corectă fără să aștepți scroll)
    update();
    window.addEventListener("scroll", onScroll, passive);

    return () => {
      window.removeEventListener("scroll", onScroll, passive);
    };
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
