"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Strich = { major: string; minor: string };

type Props = {
  /** Linienfarben je Fassung. Welche gilt, liest die Leinwand an der Klasse `dark`. */
  farben: { hell: Strich; dunkel: Strich };
  staerke?: { major: number; minor: number };
  className?: string;
  style?: CSSProperties;
};

/** Rasterzelle in Pixeln. 8 statt 5 viertelt die Arbeit je Bild, die Linien bleiben glatt. */
const RES = 8;
const LEVELS = 14;

/**
 * Höhenlinien, die dem Zeiger folgen. Gemeinsam für Hero und Fuss.
 *
 * Rechnet nur, wenn die Fläche im Sichtfeld liegt und der Tab vorne ist. Wer
 * „Bewegung reduzieren" gesetzt hat, bekommt ein einzelnes stehendes Bild.
 * Vorher liefen zwei Schleifen dauerhaft, auch weit ausserhalb des Bildes.
 *
 * Die Farbe folgt der Klasse `dark` am Dokument, nicht einem React-Zustand.
 * So braucht es kein `mounted` und keinen zweiten Render nach der Hydration.
 */
export function ContoursCanvas({
  farben,
  staerke = { major: 1.6, minor: 1 },
  className,
  style,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const farbenRef = useRef(farben);
  useEffect(() => {
    farbenRef.current = farben;
  }, [farben]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let t = 0;
    let raf = 0;
    let sichtbar = false;
    const mouse = { x: 0.5, y: 0.4 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    };
    const onTouch = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const p = e.touches[0];
      mouse.x = (p.clientX - r.left) / r.width;
      mouse.y = (p.clientY - r.top) / r.height;
    };

    const zeichne = () => {
      const dunkel = document.documentElement.classList.contains("dark");
      const farbe = dunkel ? farbenRef.current.dunkel : farbenRef.current.hell;
      const cols = Math.ceil(w / RES) + 1;
      const rows = Math.ceil(h / RES) + 1;
      const { x: mx, y: my } = mouse;

      const f = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1);
          const ny = r / (rows - 1);
          let v = Math.sin(nx * 5.2 + t * 0.7) * Math.cos(ny * 3.8 - t * 0.55);
          v += Math.sin(nx * 2.8 - t * 0.35) * Math.cos(ny * 6.1 + t * 0.48) * 0.55;
          v += Math.sin((nx * 1.5 + ny * 2.2) * 3 + t * 0.28) * 0.35;
          const dx = nx - mx;
          const dy = ny - my;
          v += Math.exp(-(dx * dx + dy * dy) * 14) * 1.8;
          f[r * cols + c] = v;
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (let li = 0; li < LEVELS; li++) {
        const thr = -1.6 + (li / (LEVELS - 1)) * 3.2;
        const isMajor = li % 3 === 0;
        ctx.strokeStyle = isMajor ? farbe.major : farbe.minor;
        ctx.lineWidth = isMajor ? staerke.major : staerke.minor;
        ctx.beginPath();

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const v00 = f[r * cols + c];
            const v10 = f[r * cols + c + 1];
            const v01 = f[(r + 1) * cols + c];
            const v11 = f[(r + 1) * cols + c + 1];
            const px = c * RES;
            const py = r * RES;

            const eT = v00 > thr !== v10 > thr;
            const eR = v10 > thr !== v11 > thr;
            const eB = v01 > thr !== v11 > thr;
            const eL = v00 > thr !== v01 > thr;

            const pts: { x: number; y: number }[] = [];
            if (eT) pts.push({ x: px + ((thr - v00) / (v10 - v00)) * RES, y: py });
            if (eR) pts.push({ x: px + RES, y: py + ((thr - v10) / (v11 - v10)) * RES });
            if (eB) pts.push({ x: px + ((thr - v01) / (v11 - v01)) * RES, y: py + RES });
            if (eL) pts.push({ x: px, y: py + ((thr - v00) / (v01 - v00)) * RES });

            if (pts.length === 2) {
              ctx.moveTo(pts[0].x, pts[0].y);
              ctx.lineTo(pts[1].x, pts[1].y);
            } else if (pts.length === 4) {
              const center = (v00 + v10 + v01 + v11) / 4;
              if (center > thr === v00 > thr) {
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[3].x, pts[3].y);
                ctx.moveTo(pts[1].x, pts[1].y);
                ctx.lineTo(pts[2].x, pts[2].y);
              } else {
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[1].x, pts[1].y);
                ctx.moveTo(pts[3].x, pts[3].y);
                ctx.lineTo(pts[2].x, pts[2].y);
              }
            }
          }
        }
        ctx.stroke();
      }
    };

    const schleife = () => {
      t += 0.003;
      zeichne();
      raf = requestAnimationFrame(schleife);
    };
    const start = () => {
      if (raf) return;
      if (reduce.matches) {
        zeichne();
        return;
      }
      raf = requestAnimationFrame(schleife);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const pruefe = () => {
      if (sichtbar && !document.hidden) start();
      else stop();
    };
    const onReduce = () => {
      stop();
      pruefe();
    };

    const io = new IntersectionObserver(
      ([eintrag]) => {
        sichtbar = eintrag.isIntersecting;
        pruefe();
      },
      { rootMargin: "10% 0px" },
    );
    // Wechselt das Thema, während die Schleife steht, braucht es ein neues Bild.
    const mo = new MutationObserver(() => {
      if (!raf) zeichne();
    });

    resize();
    zeichne();
    io.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", pruefe);
    reduce.addEventListener("change", onReduce);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", pruefe);
      reduce.removeEventListener("change", onReduce);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resize);
    };
  }, [staerke.major, staerke.minor]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}
    />
  );
}
