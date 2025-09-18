import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  const frameRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const messages = [
    "Technology",
    "From prototypes to production",
    "Passion into practice",
    "Here you'll find everything",
    "Hi, I'm Călin"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [rollPhase, setRollPhase] = useState(''); // pornim vizibil
  const [didStopAtLast, setDidStopAtLast] = useState(false);

  // secvența finală
  const [slideUp, setSlideUp] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // video + starea compactă
  const [firstEnded, setFirstEnded] = useState(false);
  const [startedClip2, setStartedClip2] = useState(false);
  const [lastMessageShown, setLastMessageShown] = useState(false);

  // „Rola" la 1.7s; ultimul mesaj rămâne pe ecran
  useEffect(() => {
    const id = setInterval(() => {
      const isLast = currentMessageIndex === messages.length - 1;
      if (isLast) {
        setDidStopAtLast(true);
        // Marchează că ultimul mesaj s-a afișat
        setTimeout(() => {
          setLastMessageShown(true);
        }, 100); // mic delay să se vadă mesajul
        clearInterval(id);
        return;
      }
      setRollPhase('out');
      setTimeout(() => {
        setCurrentMessageIndex(p => p + 1);
        setRollPhase('in');
        setTimeout(() => setRollPhase(''), 450);
      }, 300);
    }, 1850);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessageIndex]);

  // Scroll: zoom-in pe video (local față de hero), cu parallax subtil
  useEffect(() => {
    const v1 = videoRef1.current;
    const v2 = videoRef2.current;
    const frame = frameRef.current;
    if (!frame || (!v1 && !v2)) return;

    const ZOOM_FULL = { base: 1.10, max: 1.25 };   // când e fullscreen (clip 1)
    const ZOOM_COMPACT = { base: 1.05, max: 2.0 }; // când e compact (clip 2)
    const PARALLAX_FACTOR = 0.15;

    let ticking = false;
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const update = () => {
      ticking = false;
      const rect = frame.getBoundingClientRect();
      const height = rect.height || window.innerHeight;
      const t = clamp(-rect.top / height, 0, 1); // progres 0..1 prin hero
      const cfg = startedClip2 ? ZOOM_COMPACT : ZOOM_FULL;
      const scale = cfg.base + (cfg.max - cfg.base) * t;
      const translateY = -rect.top * PARALLAX_FACTOR;
      const transform = `translateY(${translateY}px) scale(${scale})`;
      if (v1) v1.style.transform = transform;
      if (v2) v2.style.transform = transform;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [startedClip2]);

  // Clipul 1 s-a terminat (păstrăm ultimul frame până sincronizăm cu ultimul mesaj)
  const handleFirstVideoEnded = () => setFirstEnded(true);

  // NOUĂ LOGICĂ: Pornim clipul 2 după ce ultimul mesaj e afișat + pauză
  useEffect(() => {
    if (!startedClip2 && firstEnded && lastMessageShown) {
      // Pauză de 1.2 secunde după ce ultimul mesaj e afișat
      const pauseTimeout = setTimeout(() => {
        const v1 = videoRef1.current;
        const v2 = videoRef2.current;
        if (v1 && v2) {
          v1.style.opacity = 0;   // fade-out clip 1
          v2.style.opacity = 1;   // fade-in clip 2
          try { v2.currentTime = 0; } catch {}
          try { v2.play(); } catch {}
        }
        setStartedClip2(true);    // declanșează „shrink" (starea compactă)
        setSlideUp(true);         // slide-up exact acum

        // subtitlu + buton după slide-up
        setTimeout(() => setShowSubtitle(true), 500);
        setTimeout(() => setShowButton(true), 900);
      }, 300); // PAUZA AICI - 1.2 secunde

      return () => clearTimeout(pauseTimeout);
    }
  }, [firstEnded, lastMessageShown, startedClip2]);

  const isLast = currentMessageIndex === messages.length - 1;

  return (
    <section
      id="hero"
      ref={frameRef}
      className={[
        styles.heroFrame,
        startedClip2 ? styles.frameCompact : ''
      ].join(' ')}
    >
      {/* panou care se restrânge (inset + radius + padding + scale) */}
      <div className={styles.heroPanel}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef1}
            className={styles.heroVideo}
            autoPlay
            muted
            playsInline
            src="/HeroBackground/hero_video.mp4"
            onEnded={handleFirstVideoEnded}
            style={{ opacity: 1 }}
          />
          <video
            ref={videoRef2}
            className={styles.heroVideo}
            muted
            loop
            playsInline
            src="/HeroBackground/hero_video2.mp4"
            style={{ opacity: 0 }}
          />
          <div className={styles.overlay}></div>
        </div>

        {/* conținut centrat vertical perfect */}
        <div className={styles.heroInner}>
          <div className={[styles.messageSlot, slideUp ? styles.messageSlotLifting : ''].join(' ')}>
            <h1
              className={[
                styles.heroTitle,
                rollPhase === 'out' ? styles.rollOut : '',
                rollPhase === 'in' ? styles.rollIn : '',
                isLast && didStopAtLast ? styles.holdFinal : '',
                isLast && slideUp ? styles.slideUpLock : '',
              ].join(' ')}
            >
              {/* Pentru ultimul mesaj în starea slideUp, împărțim în cuvinte animate */}
              {isLast && slideUp ? (
                <div className={styles.animatedText}>
                  {messages[currentMessageIndex].split(' ').map((word, index) => (
                    <span 
                      key={index} 
                      className={styles.word}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                messages[currentMessageIndex]
              )}
            </h1>
          </div>

          <div className={[styles.subContainer, isLast && slideUp ? styles.compactBelow : ''].join(' ')}>
            <p className={[styles.heroSubtitle, showSubtitle ? styles.revealFade : ''].join(' ')}>
              Welcome! Explore my work, process, tools, and how we can work together.            
            </p>
            <a
              href="#projects"
              className={[styles.heroButton, showButton ? styles.revealFadeBtn : ''].join(' ')}
            >
              View Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;