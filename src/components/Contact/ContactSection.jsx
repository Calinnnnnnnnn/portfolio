import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Linkedin, Instagram, Github } from "lucide-react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  // stări UX pentru trimitere
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  // Mouse tracking pentru efectul gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Intersection Observer pentru animații
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // EmailJS – din .env (Vite)
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // validare simplă email
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", msg: "" });

    // honeypot anti-spam
    const honey = formRef.current?.elements["company"]?.value;
    if (honey) {
      setStatus({ type: "success", msg: "Thank you! Your message has been sent." });
      formRef.current.reset();
      return;
    }

    // validări minime înainte de trimitere
    const name = formRef.current?.elements["name"]?.value.trim();
    const email = formRef.current?.elements["email"]?.value.trim();
    const message = formRef.current?.elements["message"]?.value.trim();

    if (!name || !email || !message) {
      setStatus({ type: "error", msg: "Please complete all fields." });
      return;
    }
    if (!isEmail(email)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({
        type: "error",
        msg: "Email service is not configured. Please set EmailJS keys in .env.",
      });
      return;
    }

    setSending(true);
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus({ type: "success", msg: "Thank you! Your message has been sent." });
      formRef.current.reset();
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Something went wrong while sending your message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const dynamicStyle = {
    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(248, 223, 208, 0.08) 0%, transparent 50%),
                 linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #eff6ff 100%)`
  };

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className={styles.contactSection}
      style={dynamicStyle}
      aria-labelledby="contact-title"
    >
      {/* Floating geometric shapes */}
      <div className={styles.floatingShapes}>
        <div className={`${styles.shape} ${styles.shape1}`} />
        <div className={`${styles.shape} ${styles.shape2}`} />
        <div className={`${styles.shape} ${styles.shape3}`} />
      </div>

      {/* Grid pattern overlay */}
      <div className={styles.gridOverlay} />

      <div className={styles.container}>
        {/* Header Section */}
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.badge}>
            <div className={styles.badgeDot} />
            Available for new projects
          </div>
          
          <h2 id="contact-title" className={styles.title}>
            Let's Create
            <br />
            <span className={styles.titleAccent}>Something Amazing</span>
          </h2>
          
          <p className={styles.subtitle}>
            Ready to bring your vision to life? Let's discuss your project and create something extraordinary together.
          </p>
        </div>

        {/* Contact Grid */}
        <div className={`${styles.grid} ${isVisible ? styles.visible : ''}`}>
          
          {/* Quick Contact Options */}
          <div className={styles.quickContact}>
            <h3 className={styles.sectionTitle}>Get in Touch</h3>
            
            {/* Email Card */}
            <div className={`${styles.contactCard} ${styles.emailCard}`}>
              <div className={styles.cardGradient} />
              <div className={styles.cardContent}>
                <div className={`${styles.cardIcon} ${styles.emailIcon}`}>
                  <svg className={styles.iconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={styles.cardInfo}>
                  <h4 className={styles.cardTitle}>Email</h4>
                  <p className={styles.cardValue}>ilieioancalin.2003@gmail.com</p>
                  <p className={styles.cardNote}>I'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className={`${styles.contactCard} ${styles.phoneCard}`}>
              <div className={styles.cardGradient} />
              <div className={styles.cardContent}>
                <div className={`${styles.cardIcon} ${styles.phoneIcon}`}>
                  <svg className={styles.iconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className={styles.cardInfo}>
                  <h4 className={styles.cardTitle}>Phone</h4>
                  <p className={styles.cardValue}>+40 731 192 530</p>
                  <p className={styles.cardNote}>Available Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
            </div>

           {/* Social Links */}
            <div className={styles.socialLinks}>
              <a 
                href="https://www.linkedin.com/in/ioan-calin-ilie-19a4552a9/?profileId=ACoAAEpId8YB6EZ8wePhiVLJDxuy1i7GRDBoqWo" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className={styles.socialIcon}
              >
                <Linkedin />
              </a>
              <a 
                href="https://www.instagram.com/calin.ilie/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className={styles.socialIcon}
              >
                <Instagram />
              </a>
              <a 
                href="https://github.com/Calinnnnnnnnn" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub"
                className={styles.socialIcon}
              >
                <Github />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formWrapper}>
            <div className={styles.formContainer}>
              <div className={styles.formHeader} />
              
              <div className={styles.formContent}>
                <h3 className={styles.formTitle}>Send a Message</h3>
                <p className={styles.formDescription}>Tell me about your project and let's make it happen</p>

                <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="company"
                    autoComplete="off"
                    className={styles.honey}
                    tabIndex="-1"
                    aria-hidden="true"
                  />

                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="name" className={styles.label}>Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        required 
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="email" className={styles.label}>Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="you@example.com" 
                        required 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="message" className={styles.label}>Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      placeholder="Tell me about your project..." 
                      rows="5" 
                      required 
                      className={`${styles.input} ${styles.textarea}`}
                    />
                  </div>

                  <button type="submit" className={styles.submitButton} disabled={sending}>
                    <div className={styles.buttonShine} />
                    <span className={styles.buttonContent}>
                      {sending ? (
                        <>
                          <div className={styles.spinner} />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>

                  <div
                    className={
                      status.type === "success"
                        ? styles.statusSuccess
                        : status.type === "error"
                        ? styles.statusError
                        : styles.statusIdle
                    }
                    aria-live="polite"
                    role="status"
                  >
                    {status.msg}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}