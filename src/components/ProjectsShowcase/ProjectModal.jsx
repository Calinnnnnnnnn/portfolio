import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProjectModal.module.css";

/**
 * Props:
 *  - project: { id, title, description, tech[], links:{live,repo}, images[] | image }
 *  - isOpen: boolean
 *  - onClose: () => void
 */
export default function ProjectModal({ project, isOpen, onClose }) {
  const [idx, setIdx] = useState(0);
  const thumbsRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);

  const images = useMemo(() => {
    if (!project) return [];
    if (project.images?.length) return project.images;
    return project.image ? [project.image] : [];
  }, [project]);

  // open/close side effects: esc, body lock, hide navbar via html.modal-open
  useEffect(() => {
    if (!isOpen) return;
    setIdx(0);

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % Math.max(images.length, 1));
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("modal-open");
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("modal-open");
      clearTimeout(t);
    };
  }, [isOpen, images.length, onClose]);

  // thumbs scroll arrows visibility
  const updateThumbScrollState = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanL(scrollLeft > 2);
    setCanR(scrollLeft + clientWidth < scrollWidth - 2);
  };
  useEffect(() => {
    updateThumbScrollState();
  }, [images, isOpen]);

  const scrollThumbs = (dir) => {
    const el = thumbsRef.current;
    if (!el) return;
    const delta = Math.max(200, Math.round(el.clientWidth * 0.8)) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const onThumbsScroll = () => updateThumbScrollState();

  if (!isOpen || !project) return null;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          ref={closeBtnRef}
          aria-label="Close"
          title="Close"
        >✕</button>

        {/* LEFT: details */}
        <aside className={styles.left}>
          <h3 id="pm-title" className={styles.title}>{project.title}</h3>
          {project.description && <p className={styles.desc}>{project.description}</p>}

          {project.tech?.length > 0 && (
            <ul className={styles.chips} role="list">
              {project.tech.map((t) => <li key={t} className={styles.chip}>{t}</li>)}
            </ul>
          )}

        </aside>

        {/* RIGHT: gallery */}
        <main className={styles.right}>
          <div className={styles.hero}>
            {images.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt=""
                className={`${styles.heroImg} ${i === idx ? styles.show : styles.hide}`}
                draggable={false}
              />
            ))}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.leftBtn}`}
                  aria-label="Previous image"
                  onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                >←</button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.rightBtn}`}
                  aria-label="Next image"
                  onClick={() => setIdx((i) => (i + 1) % images.length)}
                >→</button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbsWrap}>
              {canL && <div className={`${styles.fade} ${styles.fadeL}`} aria-hidden="true" />}
              {canR && <div className={`${styles.fade} ${styles.fadeR}`} aria-hidden="true" />}

              <div className={styles.thumbs} ref={thumbsRef} onScroll={onThumbsScroll}>
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    className={`${styles.thumbBtn} ${i === idx ? styles.thumbActive : ""}`}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to image ${i + 1}`}
                    title={`Image ${i + 1}`}
                  >
                    <img src={src} alt="" className={styles.thumbImg} />
                  </button>
                ))}
              </div>

              {/* scroll arrows for the thumb strip */}
              {canL && (
                <button
                  type="button"
                  className={`${styles.scrollBtn} ${styles.scrollL}`}
                  onClick={() => scrollThumbs(-1)}
                  aria-label="Scroll thumbnails left"
                >‹</button>
              )}
              {canR && (
                <button
                  type="button"
                  className={`${styles.scrollBtn} ${styles.scrollR}`}
                  onClick={() => scrollThumbs(1)}
                  aria-label="Scroll thumbnails right"
                >›</button>
              )}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
