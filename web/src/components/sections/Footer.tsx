"use client";
import Link from "next/link";
import { brand } from "@/data/brand";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { LogoWordmark } from "@/components/ui/logo";
import { openConsentSettings } from "@/lib/consent";
import { useTheme } from "next-themes";

// ── Interactive contour lines canvas ─────────────────────────────────────
function ContoursCanvas({ darkMode }: { darkMode: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.4 });
  const darkRef = useRef(darkMode);
  useEffect(() => { darkRef.current = darkMode; }, [darkMode]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, t = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
    };
    const onTouch = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.current = {
        x: (touch.clientX - r.left) / r.width,
        y: (touch.clientY - r.top) / r.height,
      };
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    const RES = 5;

    const draw = () => {
      t += 0.003;
      const cols = Math.ceil(w / RES) + 1;
      const rows = Math.ceil(h / RES) + 1;
      const { x: mx, y: my } = mouse.current;

      const f = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1);
          const ny = r / (rows - 1);
          let v = Math.sin(nx * 5.2 + t * 0.7) * Math.cos(ny * 3.8 - t * 0.55);
          v += Math.sin(nx * 2.8 - t * 0.35) * Math.cos(ny * 6.1 + t * 0.48) * 0.55;
          v += Math.sin((nx * 1.5 + ny * 2.2) * 3 + t * 0.28) * 0.35;
          const dx = nx - mx, dy = ny - my;
          v += Math.exp(-(dx * dx + dy * dy) * 14) * 1.8;
          f[r * cols + c] = v;
        }
      }

      ctx.clearRect(0, 0, w, h);

      const LEVELS = 14;
      for (let li = 0; li < LEVELS; li++) {
        const thr = -1.6 + (li / (LEVELS - 1)) * 3.2;
        const isMajor = li % 3 === 0;
        // Dark mode: white lines, Light mode: light blue lines
        ctx.strokeStyle = darkRef.current
          ? `rgba(100,150,220,${isMajor ? 0.5 : 0.25})`
          : `rgba(0,0,0,${isMajor ? 0.18 : 0.09})`;
        ctx.lineWidth = isMajor ? 2.2 : 1.4;
        ctx.beginPath();

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const v00 = f[r * cols + c];
            const v10 = f[r * cols + c + 1];
            const v01 = f[(r + 1) * cols + c];
            const v11 = f[(r + 1) * cols + c + 1];
            const px = c * RES, py = r * RES;

            const eT = (v00 > thr) !== (v10 > thr);
            const eR = (v10 > thr) !== (v11 > thr);
            const eB = (v01 > thr) !== (v11 > thr);
            const eL = (v00 > thr) !== (v01 > thr);

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
              if ((center > thr) === (v00 > thr)) {
                ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[3].x, pts[3].y);
                ctx.moveTo(pts[1].x, pts[1].y); ctx.lineTo(pts[2].x, pts[2].y);
              } else {
                ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[1].x, pts[1].y);
                ctx.moveTo(pts[3].x, pts[3].y); ctx.lineTo(pts[2].x, pts[2].y);
              }
            }
          }
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        mixBlendMode: darkMode ? "lighten" : "multiply",
      }}
    />
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const lockupRef = useRef<HTMLDivElement>(null);
  const lockupInView = useInView(lockupRef, { once: true, margin: "-80px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background/95">
      {/* Animated contour lines canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && <ContoursCanvas darkMode={resolvedTheme === "dark"} />}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 md:px-12 lg:px-24">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-4 mb-20">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex flex-col gap-4">
              <div ref={lockupRef} className="w-fit text-foreground">
                <LogoWordmark className="h-9 w-auto" animate={lockupInView} />
              </div>
              <p className="text-sm leading-relaxed text-foreground/70 max-w-sm">
                {brand.tagline}
              </p>
              <p className="text-xs text-foreground/50">
                Seit {brand.established}
              </p>
            </div>
          </div>

          {/* Navigation column */}
          <div className="">
            <h4 className="eyebrow text-foreground mb-6 text-xs">Navigation</h4>
            <nav className="flex flex-col gap-4">
              {brand.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-foreground/60 hover:text-foreground transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact column */}
          <div className="">
            <h4 className="eyebrow text-foreground mb-6 text-xs">Kontakt</h4>
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${brand.contact.email}`}
                className="text-sm text-foreground/60 hover:text-foreground transition-all duration-300 flex items-center gap-3 group"
              >
                <Mail className="w-4 h-4 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <span className="truncate">{brand.contact.email}</span>
              </a>
              <a
                href={`tel:${brand.contact.phone}`}
                className="text-sm text-foreground/60 hover:text-foreground transition-all duration-300 flex items-center gap-3 group"
              >
                <Phone className="w-4 h-4 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                {brand.contact.phone}
              </a>
              <div className="text-sm text-foreground/60 flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500/50" />
                {brand.location}
              </div>
            </div>
          </div>

          {/* CTA column */}
          <div className="flex flex-col gap-4 justify-between">
            <div>
              <h4 className="eyebrow text-foreground mb-4 text-xs">Lust auf einen Auftrag?</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Kontaktieren Sie uns unverbindlich für ein persönliches Gespräch.
              </p>
            </div>
            <Link
              href="#kontakt"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 group text-sm font-medium"
            >
              Anfrage stellen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent mb-12" />

        {/* Bottom section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 text-xs text-foreground/50">
            <span>
              © {year} {brand.name}. Alle Rechte vorbehalten.
            </span>
            <div className="flex gap-6">
              <Link 
                href="/impressum" 
                className="hover:text-foreground/80 transition-colors duration-300"
              >
                Impressum
              </Link>
              <Link 
                href="/datenschutz" 
                className="hover:text-foreground/80 transition-colors duration-300"
              >
                Datenschutz
              </Link>
              <button
                type="button"
                onClick={openConsentSettings}
                className="text-left hover:text-foreground/80 transition-colors duration-300"
              >
                Cookie-Einstellungen
              </button>
            </div>
          </div>

          {/* Social/Tech badges */}
          <div className="flex gap-4 flex-wrap">
            <div className="px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs text-foreground/60 hover:border-foreground/30 transition-colors cursor-default">
              Made with Next.js
            </div>
            <div className="px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs text-foreground/60 hover:border-foreground/30 transition-colors cursor-default">
              Hosting in der Schweiz
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
