import React, { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./ProjectsShowcase.module.css";
import ProjectModal from "./ProjectModal";

const PROJECTS = [
  {
    id: "registru-ssi",
    title: "Internal Registry for ADR – SSI",
    subtitle: "On-prem web app · RBAC · Analytics · Classified data",
    image: "projects/registru-ssi/home.png",
    images: [
      "projects/registru-ssi/home.png",
      "projects/registru-ssi/login.png",
      "projects/registru-ssi/dashboard.png",
      "projects/registru-ssi/registru_intrari.png",
      "projects/registru-ssi/adaugare_intrare.png",
      "projects/registru-ssi/statistici.png",
    ],
    href: "/#registru",
    device: "laptop",
    description:
      "ADR–SSI Electronic Registry digitizes the registry workflow end-to-end: it centralizes incoming/outgoing documents, assigns work to designated staff, tracks deadlines, and offers fast search with an activity dashboard. Role-based access and full audit trails protect confidential/secret documents, with secure file uploads for complete traceability.",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Nginx", "bcrypt", "JWT", "Linux server"],
    links: { live: "/#registru", repo: null },
  },
  {
    id: "real-estate",
    title: "Real Estate Platform",
    subtitle: "Listings · Auth · Advanced filters",
    image: "projects/real-estate/Intampinare.png",
    images: [
      "projects/real-estate/Intampinare.png",
      "projects/real-estate/Home.png",
      "projects/real-estate/Home2.png",
      "projects/real-estate/Lista.png",
      "projects/real-estate/Statistici.png",
    ],
    href: "/#real-estate",
    device: "laptop",
    description:
      "Homyz is a complete platform that enables efficient management of real estate listings, making it easy to publish, organize, and promote properties in an intuitive and accessible way. Users interact with the platform through an intuitive interface where they can view, filter, and publish real estate listings. Their actions generate HTTP requests to the application server, which processes business logic, validates data, and manages authentication. The server then queries the database to retrieve or update the necessary information, and the responses are converted into structured data displayed in real-time by the interface, offering a smooth and fast experience.",
    tech: ["React", "Node.js", "Express", "MySQL", "bcrypt", "JWT"],
    links: { live: "/#real-estate", repo: null },
  },
  {
    id: "events-organiser",
    title: "Events Organiser",
    subtitle: "Plan & manage events · Tickets · Scheduling",
    image: "projects/events-organiser/AWJ1.png",
    images: [
      "projects/events-organiser/AWJ1.png",
      "projects/events-organiser/AWJ2.png",
      "projects/events-organiser/AWJ6.png",
      "projects/events-organiser/AWJ5.png",
      "projects/events-organiser/AWJ4.png",
    ],
    href: "/#events-organiser",
    device: "laptop",
    description:
      "Create, schedule and manage events with ticketing, attendee lists and reminders. Users create accounts and configure desired events by filling in details about location, participants, and extra options. All information is stored in the database and can be edited at any time. Organizers can send automatic notifications and monitor invitation status from the centralized dashboard.",
    tech: ["Java", "Java SpringBoot", "MySQL", "bcrypt", "HTML", "CSS"],
    links: { live: "/#events-organiser", repo: null },
  },
  {
    id: "music-visualizer",
    title: "Music Visualizer",
    subtitle: "Real-time audio analysis · WebGL animations",
    image: "projects/music-visualizer/Home.png",
    images: [
      "projects/music-visualizer/Home.png",
      "projects/music-visualizer/ss_pagina_about.png",
      "projects/music-visualizer/ss_pagina_live_music_visualizer_1.png",
      "projects/music-visualizer/ss_pagina_AI_1.png",
      "projects/music-visualizer/ss_pagina_AI_2.png",
      "projects/music-visualizer/ss_pagina_Trap_Visualizer_1.png",
    ],
    href: "/#music-visualizer",
    device: "laptop",
    description:
      "Real-time spectrum + waveform visualizations driven by the Web Audio API and WebGL. The user uploads an audio file or enables the microphone, the application processes the signal in real time and generates synchronized visualizations. Optionally, AI videos can be created based on the song's characteristics, which can then be downloaded or viewed directly on the platform.",
    tech: [
      "Web Audio API",
      "Canvas/WebGL",
      "React",
      "Node.js",
      "Express",
      "Tailwind CSS",
      "Replicate API - WaveSpeed, LLaVA",
    ],
    links: { live: "/#music-visualizer", repo: null },
  },
];

export default function ProjectsShowcase({
  projects = PROJECTS,
  eyebrow = "Selected work",
  heading = "Projects",
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isVisible, setIsVisible] = useState(false);

  // refs
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRefs = useRef([]);
  const previewRef = useRef(null);
  const gridRef = useRef(null);
  const listRef = useRef(null);

  const active = useMemo(
    () => projects[Math.min(Math.max(activeIdx, 0), projects.length - 1)],
    [projects, activeIdx, projects.length]
  );

  // Animații de intrare
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Mouse parallax subtil pe preview
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  // Stagger listă + header
  useEffect(() => {
    if (!isVisible) return;
    listRefs.current.forEach((ref, i) => {
      if (ref) setTimeout(() => {
        ref.style.opacity = "1";
        ref.style.transform = "translateX(0) translateY(0)";
      }, i * 120);
    });
    if (headerRef.current) {
      setTimeout(() => {
        headerRef.current.style.opacity = "1";
        headerRef.current.style.transform = "translateY(0)";
      }, 150);
    }
  }, [isVisible]);

  // 🔧 Sincronizează panoul de preview cu înălțimea + top-ul listei
  useLayoutEffect(() => {
    const syncPreview = () => {
      if (!gridRef.current || !listRef.current || !previewRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const listRect = listRef.current.getBoundingClientRect();

      const topOffset = Math.max(0, Math.round(listRect.top - gridRect.top));
      const height = Math.max(0, Math.round(listRect.height));

      const el = previewRef.current;
      el.style.marginTop = `${topOffset}px`;
      el.style.height = `${height}px`;
    };

    const run = () => {
      syncPreview();
      // mic post-layout tick
      setTimeout(syncPreview, 50);
      setTimeout(syncPreview, 150);
    };

    run();

    const ro = new ResizeObserver(run);
    try {
      if (gridRef.current) ro.observe(gridRef.current);
      if (listRef.current) ro.observe(listRef.current);
      ro.observe(document.body);
    } catch {}

    const onResize = () => run();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    if (document.fonts?.ready) {
      document.fonts.ready.then(run).catch(() => {});
    }

    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // index curent pentru hover/focus
  const currentIdx = hoverIdx ?? activeIdx;

  const handleOpen = (idx, e) => {
    if (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return; // nu blocăm navigarea în tab nou etc.
      }
      e.preventDefault(); // blocăm navigarea normală
    }
    setActiveIdx(idx);
    setIsModalOpen(true);
  };

  return (
    <section
      id="projects"
      className={`${styles.projectsSection} ${styles.section}`}
      aria-labelledby="projects-heading"
      ref={sectionRef}
      style={{
        "--mouse-x": mousePosition.x,
        "--mouse-y": mousePosition.y
      }}
    >
      <div className={styles.container}>
        <header className={`${styles.header} ${styles.animatedHeader}`} ref={headerRef}>
          <p className={styles.eyebrow}>
            {eyebrow.split("").map((c, i) => (
              <span key={i} style={{ animationDelay: `${i * 50}ms` }}>{c}</span>
            ))}
          </p>
          <h2 id="projects-heading" className={styles.h2}>
            {heading.split("").map((c, i) => (
              <span key={i} className={styles.letterReveal} style={{ animationDelay: `${i * 100}ms` }}>{c}</span>
            ))}
          </h2>
          <p className={styles.sublead}>Real products designed & shipped. Feel free to explore! Just click!</p>
        </header>

        <div className={styles.grid} ref={gridRef}>
          {/* LEFT: listă simplă */}
          <div className={styles.leftCol}>
            <ul className={styles.list} role="list" ref={listRef}>
              {projects.map((p, i) => {
                const isActive = i === currentIdx;
                return (
                  <li
                    key={p.id}
                    className={`${styles.item} ${styles.animatedItem}`}
                    ref={(el) => { if (el) listRefs.current[i] = el; }}
                    style={{
                      opacity: 0,
                      transform: "translateX(-30px) translateY(16px)",
                      transition: "opacity .7s cubic-bezier(.22,.9,.22,1), transform .7s cubic-bezier(.22,.9,.22,1)",
                    }}
                    onMouseEnter={() => { setHoverIdx(i); setActiveIdx(i); }}
                    onMouseLeave={() => setHoverIdx(null)}
                  >
                    <a
                      href={p.href}
                      className={`${styles.link} ${isActive ? styles.active : ""}`}
                      onFocus={() => { setHoverIdx(i); setActiveIdx(i); }}
                      onBlur={() => setHoverIdx(null)}
                      onClick={(e) => handleOpen(i, e)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Spacebar") {
                          e.preventDefault();
                          handleOpen(i);
                        }
                      }}
                      aria-haspopup="dialog"
                    >
                      <span className={styles.index} aria-hidden="true">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <span className={styles.titles}>
                        <span className={`${styles.title} ${styles.animatedTitle}`}>{p.title}</span>
                        <span className={`${styles.subtitle} ${styles.animatedSubtitle}`}>{p.subtitle}</span>
                      </span>
                    </a>

                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: preview panel (match top & height cu lista) */}
          <div
            className={`${styles.previewPanel} ${styles.animatedPreview}`}
            aria-live="polite"
            aria-atomic="true"
            ref={previewRef}
          >
            {projects.map((p, i) => {
              const isShown = i === currentIdx;
              const d = p.device || "laptop";
              return (
                <div key={p.id} className={`${styles.deviceWrap} ${isShown ? styles.show : styles.hide}`} aria-hidden={!isShown}>
                  <div className={`${styles.device} ${d === "tablet" ? styles.tablet : styles.laptop} ${styles.floating3D}`}>
                    <div className={styles.screen}>
                      <img src={p.image} alt="" className={`${styles.previewImg} ${styles.parallaxImg}`} />
                      {d === "tablet" && <div className={styles.camera} aria-hidden="true" />}
                    </div>

                    {d === "laptop" && (
                      <div className={styles.base} aria-hidden="true">
                        <div className={styles.hinge} />
                      </div>
                    )}

                    {/* ↓↓↓ Buton mutat aici, în interiorul .device 
                    <button
                      type="button"
                      className={`${styles.detailsBtn}`}
                      onClick={() => handleOpen(i)}
                    >
                      More details
                    </button> */}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      <ProjectModal project={active} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
