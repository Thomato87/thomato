"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const fillOpacity = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  // Weicht dem Kontaktformular und dem Fuss aus. Ein Schmuckknopf, der die
  // Leistungsauswahl verdeckt, kostet genau die Anfrage, für die die Seite da ist.
  const [imWeg, setImWeg] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });

    const ziele = ["#kontakt", "footer"]
      .map((sel) => document.querySelector(sel))
      .filter((el): el is Element => el !== null);
    const sichtbar = new Set<Element>();
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting) sichtbar.add(e.target);
          else sichtbar.delete(e.target);
        }
        setImWeg(sichtbar.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    ziele.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && !imWeg && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 drop-shadow-lg"
          aria-label="Nach oben scrollen"
        >
          <svg viewBox="0 0 48 48" width="36" height="36" fill="none" aria-hidden>
            {/* Star of Life — 3 filled rectangles at 0°, 60°, 120° */}
            <g style={{ fill: "var(--brand)" }} opacity={1}>
              {/* Unfilled outline — always visible */}
              <rect x="17" y="2"  width="14" height="44" rx="2.5" fillOpacity={0.15} />
              <rect x="17" y="2"  width="14" height="44" rx="2.5" transform="rotate(60  24 24)" fillOpacity={0.15} />
              <rect x="17" y="2"  width="14" height="44" rx="2.5" transform="rotate(120 24 24)" fillOpacity={0.15} />
            </g>
            <motion.g style={{ fill: "var(--brand)", fillOpacity }}>
              <rect x="17" y="2"  width="14" height="44" rx="2.5" />
              <rect x="17" y="2"  width="14" height="44" rx="2.5" transform="rotate(60  24 24)" />
              <rect x="17" y="2"  width="14" height="44" rx="2.5" transform="rotate(120 24 24)" />
            </motion.g>

            {/* Staff */}
            <line
              x1="24" y1="10" x2="24" y2="38"
              stroke="white" strokeWidth="2" strokeLinecap="round"
            />

            {/* Snake — static S-curve, Rod of Asclepius style */}
            <path
              d="M 24,12 C 29,14.5 19,18 24,21.5 C 29,25 19,28.5 24,32"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Snake head — small upward flick */}
            <path
              d="M 24,12 C 22,10.5 21,9 23,8"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
