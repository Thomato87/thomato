import Link from "next/link";
import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { ContoursCanvas } from "@/components/ui/contours-canvas";
import { brand } from "@/data/brand";

/**
 * Blaulicht auf der Nachtstrasse, in zwei Fassungen.
 *
 * Hell oder dunkel entscheidet die Klasse `dark` am Dokument per CSS, nicht
 * ein React-Zustand nach der Hydration. Damit steht für Hell-Nutzer von der
 * ersten Farbe an die Tagesfassung; vorher sahen sie zuerst Schwarz und dann
 * den Umschlag.
 *
 * Die Tagesfassung ist dieselbe Szene bei Tageslicht: Strasse, Horizont und
 * die zwei Blitze in Markenblau auf Weiss. Der Takt ist in beiden gleich.
 * Bei „Bewegung reduzieren" stehen die Blitze als Schein, siehe globals.css.
 */
function BlaulichtBg() {
  return (
    <>
      <style>{`
        /* LINKS: Doppelblitz, hart an und aus */
        @keyframes bl-left {
          0%,100% { opacity: 0    }
          1.5%    { opacity: 0    }  2%      { opacity: 1    }
          5.5%    { opacity: 1    }  6%      { opacity: 0    }
          8.5%    { opacity: 0    }  9%      { opacity: .82  }
          13%     { opacity: .82  }  13.5%   { opacity: 0    }
        }
        /* RECHTS: gleiches Muster, kurz versetzt */
        @keyframes bl-right {
          0%,20%  { opacity: 0    }
          21.5%   { opacity: 0    }  22%     { opacity: 1    }
          25.5%   { opacity: 1    }  26%     { opacity: 0    }
          28.5%   { opacity: 0    }  29%     { opacity: .82  }
          33%     { opacity: .82  }  33.5%   { opacity: 0    }
          100%    { opacity: 0    }
        }
        @keyframes bl-wash-L {
          0%,100% { opacity: 0   }
          2%      { opacity: .22 }
          6%      { opacity: 0   }
          9%      { opacity: .16 }
          14%     { opacity: 0   }
        }
        @keyframes bl-wash-R {
          0%,20%  { opacity: 0   }
          22%     { opacity: .22 }
          26%     { opacity: 0   }
          29%     { opacity: .16 }
          34%     { opacity: 0   }
          100%    { opacity: 0   }
        }
        @keyframes horizon-glow {
          0%,100% { opacity: .25 }
          50%      { opacity: .55 }
        }
      `}</style>

      {/* Grund, per Klasse statt per Zustand */}
      <div className="absolute inset-0 bg-white dark:bg-[#020406]" />

      {/* ── Nachtfassung ── */}
      <div className="absolute inset-0 hidden dark:block" aria-hidden>
        <Szene
          spur="rgba(40,110,230,.08)"
          asphalt="rgba(2,4,6,.92)"
          horizont="linear-gradient(to right, transparent 5%, rgba(40,110,255,.3) 28%, rgba(90,165,255,.65) 50%, rgba(40,110,255,.3) 72%, transparent 95%)"
          spiegel="rgba(40,110,255,.3)"
          blitz="radial-gradient(circle, rgba(80,160,255,.55) 0%, rgba(40,110,255,.25) 35%, rgba(20,70,220,.08) 60%, transparent 72%)"
          umgebung="rgba(25,75,220,.18)"
          umgebungAussen="rgba(25,75,220,.08)"
          himmel="linear-gradient(to bottom, rgba(2,4,6,1) 0%, rgba(2,4,6,.5) 32%, transparent 52%)"
          lesbarkeit="linear-gradient(to right, rgba(2,4,6,1) 0%, rgba(2,4,6,.9) 25%, rgba(2,4,6,.5) 52%, transparent 100%)"
          korn={0.45}
        />
      </div>

      {/* ── Tagesfassung ── */}
      <div className="absolute inset-0 dark:hidden" aria-hidden>
        <Szene
          spur="rgba(0,78,196,.10)"
          asphalt="rgba(255,255,255,.96)"
          horizont="linear-gradient(to right, transparent 5%, rgba(0,78,196,.25) 28%, rgba(22,132,247,.6) 50%, rgba(0,78,196,.25) 72%, transparent 95%)"
          spiegel="rgba(0,78,196,.22)"
          blitz="radial-gradient(circle, rgba(0,78,196,.42) 0%, rgba(22,132,247,.22) 35%, rgba(22,132,247,.08) 60%, transparent 72%)"
          umgebung="rgba(0,78,196,.14)"
          umgebungAussen="rgba(0,78,196,.06)"
          himmel="linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,.6) 32%, transparent 52%)"
          lesbarkeit="linear-gradient(to right, #ffffff 0%, rgba(255,255,255,.92) 25%, rgba(255,255,255,.55) 52%, transparent 100%)"
          korn={0.3}
        />
      </div>
    </>
  );
}

type SzeneProps = {
  spur: string;
  asphalt: string;
  horizont: string;
  spiegel: string;
  blitz: string;
  umgebung: string;
  umgebungAussen: string;
  himmel: string;
  lesbarkeit: string;
  korn: number;
};

/** Die Ebenen der Szene, einmal gebaut, zweimal eingefärbt. */
function Szene(p: SzeneProps) {
  const blitzMasse = "clamp(400px, 60vw, 800px)";
  return (
    <>
      {/* Strasse in Perspektive */}
      <div
        className="bl-road"
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent 79px, ${p.spur} 79px, ${p.spur} 81px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${p.asphalt} 100%)`,
          }}
        />
      </div>

      {/* Horizont */}
      <div
        className="bl-horizon"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "44%",
          height: "1px",
          background: p.horizont,
          animation: "horizon-glow 3s ease-in-out infinite",
        }}
      />

      {/* Spiegelung auf dem Asphalt, links und rechts */}
      <div
        className="bl-wash"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: `radial-gradient(ellipse 55% 60% at 4% 0%, ${p.spiegel} 0%, transparent 70%)`,
          animation: "bl-wash-L 4s linear infinite",
        }}
      />
      <div
        className="bl-wash"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: `radial-gradient(ellipse 55% 60% at 96% 0%, ${p.spiegel} 0%, transparent 70%)`,
          animation: "bl-wash-R 4s linear infinite",
        }}
      />

      {/* Die zwei Blaulichter */}
      <div
        className="bl-glow"
        style={{
          position: "absolute",
          top: "40%",
          left: "4%",
          width: blitzMasse,
          height: blitzMasse,
          zIndex: 5,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: p.blitz,
          filter: "blur(24px)",
          animation: "bl-left 4s linear infinite",
        }}
      />
      <div
        className="bl-glow"
        style={{
          position: "absolute",
          top: "40%",
          left: "96%",
          width: blitzMasse,
          height: blitzMasse,
          zIndex: 5,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: p.blitz,
          filter: "blur(24px)",
          animation: "bl-right 4s linear infinite",
        }}
      />

      {/* Umgebung, die mit den Blitzen aufhellt */}
      <div
        className="bl-wash"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, ${p.umgebung} 0%, ${p.umgebungAussen} 60%, transparent 100%)`,
          animation: "bl-wash-L 4s linear infinite",
          pointerEvents: "none",
        }}
      />
      <div
        className="bl-wash"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to left, ${p.umgebung} 0%, ${p.umgebungAussen} 60%, transparent 100%)`,
          animation: "bl-wash-R 4s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Himmel und Lesbarkeit der linken Seite */}
      <div style={{ position: "absolute", inset: 0, background: p.himmel }} />
      <div style={{ position: "absolute", inset: 0, background: p.lesbarkeit }} />

      {/* Filmkorn */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
          opacity: p.korn,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <BlaulichtBg />
      <ContoursCanvas
        farben={{
          dunkel: { major: "rgba(60,140,255,.28)", minor: "rgba(60,140,255,.14)" },
          hell: { major: "rgba(0,20,60,.22)", minor: "rgba(0,20,60,.10)" },
        }}
        staerke={{ major: 1.6, minor: 1 }}
        className="mix-blend-multiply dark:mix-blend-screen"
      />

      {/* Linke Linie mit Jahr */}
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

      {/* Text */}
      <div className="relative z-10 flex flex-1 flex-col px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-10 md:px-12 lg:pl-28 lg:pr-16 lg:pt-36">
        {/* Die Zeilen sind vom ersten Bild an da und setzen sich nur noch.
            Ohne JavaScript stehen sie einfach, siehe .hero-line. */}
        <h1 className="display-xl flex-1 content-center text-[#050f1e] dark:text-[#eef5ff]">
          {brand.hero.headline.map((line, i) => (
            <span key={i} className="block leading-[1.0]">
              <span
                className="hero-line block"
                style={{ "--hero-delay": `${0.2 + i * 0.14}s` } as CSSProperties}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-strip mt-6 border-t border-brand/20 pt-6 sm:mt-10 sm:pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start">
            <p className="max-w-sm text-sm leading-relaxed text-[#001438]/75 dark:text-[#c4deff]/85">
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
                className="text-[#001438]/80 dark:text-[#c4deff]/90"
              >
                <Link href="#leistungen" className="flex items-center gap-2">
                  {brand.hero.cta.secondary}
                  <ArrowDown className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
