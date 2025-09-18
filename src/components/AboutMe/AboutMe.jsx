import React, { useEffect, useRef, useState } from "react";
import { Linkedin, Instagram, Github } from "lucide-react";
import styles from "./AboutMe.module.css";

const timeline = [
  {
    period:
      "2025 · Authority for Digitalization of Romania – Information Society Service (Summer Intern)",
    detail:
      "Contributed to national digital transformation projects, including project management support for the Governmental Cloud, regulatory and cybersecurity analysis of banking dossiers, and the design and development of an internal on-prem registry app for SSI (React, Node.js, PostgreSQL).",
  },
  {
    period: "2025 · Sunwave Pharma (Data Analyst Trainee)",
    detail:
      "Worked with MySQL and Power BI to build interactive dashboards and reports, aligning data insights with business objectives. Focused on supporting strategic decision-making and optimizing processes, combining technical analysis with a strong business perspective.",
  },
  {
    period: "2022–present · UNSTPB, Faculty of Automatic Control and Computer Science",
    detail:
      "B.Sc. in Systems Engineering. Engaged in software and embedded projects such as an automated retractable pergola, a music visualizer, and multiple web applications.",
  },
];

export default function AboutMe() {
  const sectionRef = useRef(null);
  const bioRef = useRef(null);
  const skillsRef = useRef(null);

  const [bioTextOn, setBioTextOn] = useState(false);
  const [skillsOn, setSkillsOn] = useState(false);

  // reveal casete mari
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(`.${styles.reveal}`));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.isVisible);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    cards.forEach((c, idx) => {
      c.style.setProperty("--reveal-delay", `${idx * 90}ms`);
      io.observe(c);
    });

    return () => io.disconnect();
  }, []);

  // bio text reveal
  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setBioTextOn(true),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // skills tag stagger
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setSkillsOn(true),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.wrapper} aria-labelledby="about-title">
      <div className={styles.grid}>
        {/* Bio Card */}
        <article className={`${styles.card} ${styles.reveal}`}>
          <h2 id="about-title" className={styles.title}>About me</h2>

          <p
            ref={bioRef}
            className={`${styles.lead} ${styles.bioReveal} ${bioTextOn ? styles.bioRevealOn : ""}`}
          >
            Hi! My name is <strong>Ilie Ioan-Călin</strong>, a 4th year student at the Politehnica
            University of Bucharest, <strong>Faculty of Automatic Control and Computer Science</strong>,
            specializing in Systems Engineering. I have a deep passion for developing software applications
            and integrated solutions.
          </p>

          <ul className={styles.bullets}>
            <li>Passionate about technology and its continuous evolution.</li>
            <li>
              Finding real satisfaction in seeing people happy when using the solutions I’ve developed,
              knowing they make life easier.
            </li>
            <li>Enjoy coordinating teams to deliver high-quality products on time.</li>
            <li>
              Built an internal <em>Registru SSI</em> app for ADR – on-prem, role-based access,
              documents flow & analytics.
            </li>
            <li>
              Developed multiple projects: a Real Estate platform (React & Node.js), an event organizer
              (Java Spring Boot), an automated retractable pergola etc.
            </li>
          </ul>

          {/* === Social Media (fundal negru) + See Projects === */}
          <div className={styles.socialSection}>
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

            <div className={styles.actions}>
              <a className={styles.ghostBtn} href="#projects">See projects</a>
            </div>
          </div>
        </article>

        {/* Photo Card */}
        <figure className={`${styles.photoCard} ${styles.reveal}`} aria-label="Portrait">
          <img src="/src/assets/profile.jpeg" alt="Calin Ilie portrait" className={styles.photo} />
          <figcaption className={styles.caption}>Bucharest · Palatul Victoria</figcaption>
        </figure>
      </div>

      {/* Timeline */}
      <div className={`${styles.timeline} ${styles.reveal}`}>
        <h3 className={styles.subTitle}>Journey</h3>
        <ol className={styles.timelineList}>
          {timeline.map((t, i) => (
            <li key={i} className={styles.timelineItem}>
              <div className={styles.dot} aria-hidden />
              <div>
                <div className={styles.period}>{t.period}</div>
                <p className={styles.detail}>{t.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Skills box */}
      <div className={`${styles.skills} ${styles.reveal}`}>
        <h3 className={styles.subTitle}>Skills</h3>
        <ul ref={skillsRef} className={`${styles.skillTags} ${skillsOn ? styles.skillsOn : ""}`}>
          <li>Project Management</li><li>Public Policy</li><li>e-Banking</li><li>React</li><li>JavaScript</li>
          <li>Node.js</li><li>Express</li><li>C/C++</li><li>Java</li><li>Python</li><li>PostgreSQL</li>
          <li>MySQL</li><li>Database Administration</li><li>Power BI</li><li>Linux</li><li>Git</li>
        </ul>
      </div>
    </section>
  );
}
