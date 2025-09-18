import { useEffect, useState } from "react";

/**
 * Returnează id-ul secțiunii active pe ecran.
 * @param {string[]} sectionIds - ex: ['about','projects','skills','contact']
 * @param {{rootMargin?: string, threshold?: number|number[]}} options
 */
export default function useScrollSpy(
  sectionIds,
  { rootMargin = "-45% 0px -50% 0px", threshold = [0, 0.25, 0.5, 0.75, 1] } = {}
) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    // setare inițială (și pentru acces direct cu #hash)
    const fromHash = window.location.hash?.replace("#", "");
    if (fromHash && sectionIds.includes(fromHash)) {
      setActiveId(fromHash);
    } else {
      // ia prima secțiune vizibilă la load
      const first = elements.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.55 && r.bottom > window.innerHeight * 0.45;
      });
      if (first) setActiveId(first.id);
    }

    let current = null;
    const observer = new IntersectionObserver(
      (entries) => {
        // alege secțiunea cu cea mai mare pondere vizibilă
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const top = visible[0].target.id;
          if (current !== top) {
            current = top;
            setActiveId(top);
          }
        }
      },
      { root: null, rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [JSON.stringify(sectionIds), rootMargin, JSON.stringify(threshold)]);

  return activeId;
}
