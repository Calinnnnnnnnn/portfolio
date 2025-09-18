import React, { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import useScrollSpy from '../../hooks/useScrollSpy';

const SECTION_IDS = ['about', 'projects', 'skills', 'contact'];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [navH, setNavH] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null);

  // calc overlap + nav height
  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > 20);
      setNavH(navRef.current?.offsetHeight ?? 0);

      const heroEl = document.getElementById('hero');
      const navEl = navRef.current;
      if (!heroEl || !navEl) return;
      const heroRect = heroEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      const overlaps = heroRect.top < navRect.bottom && heroRect.bottom > 0;
      setIsOverHero(overlaps);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // scrollspy
  const spyActiveId = useScrollSpy(SECTION_IDS, {
    rootMargin: `-${navH + 8}px 0px -55% 0px`,
    threshold: [0.2, 0.4, 0.6, 0.8, 1],
  });

  useEffect(() => {
    if (spyActiveId) setActiveSection(spyActiveId);
  }, [spyActiveId]);

  // body scroll lock când meniul e deschis + Escape pt. închidere
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [menuOpen]);

  // închide meniul dacă revii pe desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen]);

  const onNavClick = (e, targetId) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();

    const top = window.scrollY + el.getBoundingClientRect().top - (navH - 8);
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(targetId);
    window.history.replaceState(null, '', `#${targetId}`);
    setMenuOpen(false); // închide panoul pe mobil după click
  };

  const classes = [
    styles.navbar,
    isOverHero ? styles.navbarOnHero : '',
    !isOverHero && isScrolled ? styles.navbarScrolled : '',
    menuOpen ? styles.menuOpen : ''
  ].join(' ');

  return (
    <nav ref={navRef} className={classes}>
      <div className={styles.navbarContainer}>
        
        {/* LOGO TEXT */}
        <div className={styles.navbarLogo}>
          <a
            href="#hero"
            aria-label="IIC - Go to top"
            onClick={(e) => onNavClick(e, 'hero')}
          >
            <span className={styles.logoText}>IIC</span>
          </a>
        </div>

        {/* MENIU DESKTOP */}
        <div className={styles.navbarMenu}>
          <a
            href="#about"
            onClick={(e) => onNavClick(e, 'about')}
            className={`${styles.navLink} ${activeSection === 'about' ? styles.active : ''}`}
            aria-current={activeSection === 'about' ? 'page' : undefined}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => onNavClick(e, 'projects')}
            className={`${styles.navLink} ${activeSection === 'projects' ? styles.active : ''}`}
            aria-current={activeSection === 'projects' ? 'page' : undefined}
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={(e) => onNavClick(e, 'contact')}
            className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}
            aria-current={activeSection === 'contact' ? 'page' : undefined}
          >
            Contact
          </a>
        </div>

        {/* CTA DESKTOP */}
        <div className={styles.navbarCta}>
          <a
            className={styles.ctaButton}
            href="mailto:ilieioancalin.2003@gmail.com"
            aria-label="Send email to get in touch"
          >
            Get In Touch
          </a>
        </div>

        {/* HAMBURGER (mobil/tabletă) */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className={styles.hamburgerBox}>
            <span className={styles.hamburgerInner} />
          </span>
        </button>
      </div>

      {/* PANOU MOBIL */}
      <div
        id="mobile-menu"
        className={`${styles.mobilePanel} ${menuOpen ? styles.panelOpen : ''}`}
      >
        <div className={styles.mobileLinks}>
          <a href="#about" onClick={(e) => onNavClick(e, 'about')}>About</a>
          <a href="#projects" onClick={(e) => onNavClick(e, 'projects')}>Projects</a>
          <a href="#contact" onClick={(e) => onNavClick(e, 'contact')}>Contact</a>
        </div>
        <a
          className={styles.mobileCta}
          href="mailto:ilieioancalin.2003@gmail.com"
          onClick={() => setMenuOpen(false)}
        >
          Get In Touch
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
