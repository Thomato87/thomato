"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Anziehen beim Scrollen. Ein 6-Sekunden-Video liegt als 72 Einzelbilder in
 * `public/anziehen/`, jedes zweite Bild des Originals. Ein Canvas zeigt das
 * Bild, das zum Scrollfortschritt gehört; zurückscrollen zieht wieder aus.
 *
 * Kein `<video>`, weil das Springen auf eine Zeit im Video je nach Browser
 * ruckelt und auf dem iPhone kaum geht. Einzelbilder zeichnen sich sofort.
 *
 * Die Szene haftet eine Bildschirmhöhe lang, während die Bahn darunter
 * weiterläuft. Die Bahn gibt dem Leser Weg, den er zum Anziehen braucht.
 */
const ANZAHL = 72;
const BREITE = 720;
const HOEHE = 1280;
const BILD_ALT =
  "Michael Thoma zieht Helm, Jacke, Sanitätsweste und Handschuhe an.";

const bild = (i: number) => `/anziehen/f-${String(i).padStart(2, "0")}.webp`;

export function Anziehen({ children }: { children: ReactNode }) {
  const ruhig = useReducedMotion();
  const bahn = useRef<HTMLDivElement>(null);
  const leinwand = useRef<HTMLCanvasElement>(null);
  const bilder = useRef<(HTMLImageElement | null)[]>([]);
  const gezeichnet = useRef(-1);
  const [laden, setLaden] = useState(false);

  const { scrollYProgress } = useScroll({
    target: bahn,
    offset: ["start start", "end end"],
  });
  const fortschritt = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* Laden beginnt, sobald die Bahn eine Bildschirmhöhe entfernt ist. Bis
     dahin trägt der Abschnitt nur das erste Bild als gewöhnliches Bild. */
  useEffect(() => {
    const el = bahn.current;
    if (!el || ruhig) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setLaden(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ruhig]);

  /* Zeichnet das Bild zum Index; fehlt es noch, das nächste geladene davor.
     So bleibt der Canvas nie leer, während die Bilder eintreffen. */
  const zeichnen = (index: number) => {
    const c = leinwand.current;
    if (!c) return;
    let i = index;
    while (i >= 0 && !bilder.current[i]) i--;
    if (i < 0 || i === gezeichnet.current) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bilder.current[i]!, 0, 0, BREITE, HOEHE);
    gezeichnet.current = i;
  };

  useEffect(() => {
    if (!laden) return;
    let abgebrochen = false;
    let naechstes = 0;
    const laufend = 4;
    const eins = () => {
      if (abgebrochen || naechstes >= ANZAHL) return;
      const i = naechstes++;
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (abgebrochen) return;
        bilder.current[i] = img;
        const ziel = Math.round(scrollYProgress.get() * (ANZAHL - 1));
        if (i <= ziel) zeichnen(ziel);
        eins();
      };
      img.onerror = eins;
      img.src = bild(i);
    };
    for (let k = 0; k < laufend; k++) eins();
    return () => {
      abgebrochen = true;
    };
    // scrollYProgress ist ein stabiler MotionValue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laden]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    zeichnen(Math.round(v * (ANZAHL - 1)));
  });

  /* Ohne Bewegung: das fertige Bild, in gewöhnlicher Abschnittshöhe. */
  if (ruhig) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-28 md:px-12 lg:px-24">
        <Raster>
          <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-lg bg-muted md:max-w-sm">
            <Image
              src={bild(ANZAHL - 1)}
              alt={BILD_ALT}
              fill
              sizes="(min-width: 768px) 24rem, 20rem"
              className="object-cover"
            />
          </div>
          {children}
        </Raster>
      </div>
    );
  }

  return (
    <div ref={bahn} className="relative h-[260svh]">
      {/* pt hält die Szene unter der festen Navigation (py-5 plus Zeile). */}
      <div className="sticky top-0 flex h-[100svh] items-center pt-[4.75rem]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 md:py-6 lg:px-24">
          <Raster>
            <div>
              <div
                className="relative mx-auto h-[35svh] w-auto overflow-hidden rounded-lg bg-muted md:mx-0 md:h-[min(calc(100svh-11rem),44rem)]"
                style={{ aspectRatio: `${BREITE} / ${HOEHE}` }}
              >
                <Image
                  src={bild(0)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 24rem, 30vh"
                  className="object-cover"
                />
                <canvas
                  ref={leinwand}
                  width={BREITE}
                  height={HOEHE}
                  role="img"
                  aria-label={BILD_ALT}
                  className="absolute inset-0 h-full w-full"
                />
                <motion.div
                  aria-hidden
                  style={{ width: fortschritt }}
                  className="absolute bottom-0 left-0 h-0.5 bg-brand"
                />
              </div>
            </div>
            {children}
          </Raster>
        </div>
      </div>
    </div>
  );
}

function Raster({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-16">
      {children}
    </div>
  );
}
