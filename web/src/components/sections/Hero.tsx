"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/brand";

const reveal = [0.16, 1, 0.3, 1] as const;

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

    const RES = 5; // grid cell size in px

    const draw = () => {
      t += 0.003;
      const cols = Math.ceil(w / RES) + 1;
      const rows = Math.ceil(h / RES) + 1;
      const { x: mx, y: my } = mouse.current;

      // Build noise height field
      const f = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1);
          const ny = r / (rows - 1);
          let v = Math.sin(nx * 5.2 + t * 0.7) * Math.cos(ny * 3.8 - t * 0.55);
          v += Math.sin(nx * 2.8 - t * 0.35) * Math.cos(ny * 6.1 + t * 0.48) * 0.55;
          v += Math.sin((nx * 1.5 + ny * 2.2) * 3 + t * 0.28) * 0.35;
          // Mouse peak
          const dx = nx - mx, dy = ny - my;
          v += Math.exp(-(dx * dx + dy * dy) * 14) * 1.8;
          f[r * cols + c] = v;
        }
      }

      ctx.clearRect(0, 0, w, h);

      // Marching squares – draw iso-contours
      const LEVELS = 14;
      for (let li = 0; li < LEVELS; li++) {
        const thr = -1.6 + (li / (LEVELS - 1)) * 3.2;
        const isMajor = li % 3 === 0;
        ctx.strokeStyle = darkRef.current
          ? `rgba(60,140,255,${isMajor ? 0.28 : 0.14})`
          : `rgba(0,20,60,${isMajor ? 0.22 : 0.10})`;
        ctx.lineWidth = isMajor ? 1.6 : 1.0;
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
        mixBlendMode: darkMode ? "screen" : "multiply",
      }}
    />
  );
}

// ── Animated background ───────────────────────────────────────────────────
function BlaulichtBg({ darkMode }: { darkMode: boolean }) {
  return (
    <>
      <style>{`
        /* LEFT: double strobe – abrupt on/off */
        @keyframes bl-left {
          0%,100% { opacity: 0    }
          1.5%    { opacity: 0    }  2%      { opacity: 1    }
          5.5%    { opacity: 1    }  6%      { opacity: 0    }
          8.5%    { opacity: 0    }  9%      { opacity: .82  }
          13%     { opacity: .82  }  13.5%   { opacity: 0    }
        }
        /* RIGHT: same pattern, follows left after short gap */
        @keyframes bl-right {
          0%,20%  { opacity: 0    }
          21.5%   { opacity: 0    }  22%     { opacity: 1    }
          25.5%   { opacity: 1    }  26%     { opacity: 0    }
          28.5%   { opacity: 0    }  29%     { opacity: .82  }
          33%     { opacity: .82  }  33.5%   { opacity: 0    }
          100%    { opacity: 0    }
        }
        /* LEFT wash */
        @keyframes bl-wash-L {
          0%,100% { opacity: 0   }
          2%      { opacity: .22 }
          6%      { opacity: 0   }
          9%      { opacity: .16 }
          14%     { opacity: 0   }
        }
        /* RIGHT wash */
        @keyframes bl-wash-R {
          0%,20%  { opacity: 0   }
          22%     { opacity: .22 }
          26%     { opacity: 0   }
          29%     { opacity: .16 }
          34%     { opacity: 0   }
          100%    { opacity: 0   }
        }
        /* Road lines rushing forward */
        @keyframes road-fwd {
          from { background-position: 50% 0px   }
          to   { background-position: 50% 180px }
        }
        /* Horizon pulse */
        @keyframes horizon-glow {
          0%,100% { opacity: .25 }
          50%      { opacity: .55 }
        }
      `}</style>

      {/* Base background */}
      <div className="absolute inset-0" style={{ background: darkMode ? "#020406" : "#ffffff" }} />

      {darkMode && (<>
      {/* ── Perspective road grid ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "56%",
          transform: "perspective(440px) rotateX(74deg)",
          transformOrigin: "bottom center",
          overflow: "hidden",
        }}
      >
        {/* Vertical lane lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to right, transparent 0, transparent 79px, rgba(40,110,230,.08) 79px, rgba(40,110,230,.08) 81px)",
          }}
        />
        {/* Asphalt fade to black at edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(2,4,6,.92) 100%)",
          }}
        />
      </div>

      {/* ── Horizon glow line ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "44%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent 5%, rgba(40,110,255,.3) 28%, rgba(90,165,255,.65) 50%, rgba(40,110,255,.3) 72%, transparent 95%)",
          animation: "horizon-glow 3s ease-in-out infinite",
        }}
      />

      {/* ── Asphalt reflection LEFT ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background:
            "radial-gradient(ellipse 55% 60% at 4% 0%, rgba(40,110,255,.3) 0%, transparent 70%)",
          animation: "bl-wash-L 4s linear infinite",
        }}
      />
      {/* ── Asphalt reflection RIGHT ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background:
            "radial-gradient(ellipse 55% 60% at 96% 0%, rgba(40,110,255,.3) 0%, transparent 70%)",
          animation: "bl-wash-R 4s linear infinite",
        }}
      />

      {/* ── LEFT Blaulicht (soft glow only) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "40%",
          left: "4%",
          width: "clamp(400px, 60vw, 800px)",
          height: "clamp(400px, 60vw, 800px)",
          zIndex: 5,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,160,255,.55) 0%, rgba(40,110,255,.25) 35%, rgba(20,70,220,.08) 60%, transparent 72%)",
          filter: "blur(24px)",
          animation: "bl-left 4s linear infinite",
        }}
      />

      {/* ── RIGHT Blaulicht (soft glow only) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "40%",
          left: "96%",
          width: "clamp(400px, 60vw, 800px)",
          height: "clamp(400px, 60vw, 800px)",
          zIndex: 5,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,160,255,.55) 0%, rgba(40,110,255,.25) 35%, rgba(20,70,220,.08) 60%, transparent 72%)",
          filter: "blur(24px)",
          animation: "bl-right 4s linear infinite",
        }}
      />

      {/* ── Environment wash LEFT ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(25,75,220,.18) 0%, rgba(25,75,220,.08) 60%, transparent 100%)",
          animation: "bl-wash-L 4s linear infinite",
          pointerEvents: "none",
        }}
      />
      {/* ── Environment wash RIGHT ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to left, rgba(25,75,220,.18) 0%, rgba(25,75,220,.08) 60%, transparent 100%)",
          animation: "bl-wash-R 4s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── Sky: top dark gradient ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(2,4,6,1) 0%, rgba(2,4,6,.5) 32%, transparent 52%)",
        }}
      />

      {/* ── Text-legibility gradient (left side) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(2,4,6,1) 0%, rgba(2,4,6,.9) 25%, rgba(2,4,6,.5) 52%, transparent 100%)",
        }}
      />

      {/* ── Film grain ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
          opacity: 0.45,
          pointerEvents: "none",
        }}
      />
      </>)}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
export function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const darkMode = !mounted || resolvedTheme !== "light";

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <BlaulichtBg darkMode={darkMode} />
      <ContoursCanvas darkMode={darkMode} />

      {/* Left vertical rule + year stamp */}
      <div
        aria-hidden
        className="absolute left-10 top-0 bottom-0 z-10 hidden flex-col items-center lg:flex"
      >
        <div className="mt-24 w-px flex-1 bg-brand/20" />
        <span
          className="eyebrow my-5 text-[0.6rem] text-brand/40"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.25em" }}
        >
          {brand.established}
        </span>
        <div className="h-20 w-px bg-brand/20" />
      </div>

      {/* ── Text content ── */}
      <div className="relative z-10 flex flex-1 flex-col px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-10 md:px-12 lg:pl-28 lg:pr-16 lg:pt-36">
        {/* Headline */}
        <h1
          className="display-xl flex-1 content-center"
          style={{ color: darkMode ? "#eef5ff" : "#050f1e" }}
        >
          {brand.hero.headline.map((line, i) => (
            <span key={i} className="block overflow-hidden leading-[1.0]">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.95,
                  delay: 0.2 + i * 0.14,
                  ease: reveal,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Bottom strip */}
        <motion.div
          className="mt-6 pt-6 sm:mt-10 sm:pt-8 border-t border-brand/20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease: reveal }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start">
            <p
              className="max-w-sm text-sm leading-relaxed"
              style={{ color: darkMode ? "rgba(196,222,255,.82)" : "rgba(0,20,60,.72)" }}
            >
              {brand.hero.body}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="#kontakt">{brand.hero.cta.primary}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                style={{ color: darkMode ? "rgba(196,222,255,.86)" : "rgba(0,20,60,.75)" }}
              >
                <Link href="#leistungen" className="flex items-center gap-2">
                  {brand.hero.cta.secondary}
                  <ArrowDown className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
