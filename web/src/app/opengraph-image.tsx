import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/data/brand";

/**
 * Vorschaubild für soziale Netzwerke (1200×630).
 *
 * Wird beim Build einmal gerendert und als PNG ausgeliefert; die Meta-Tags
 * setzt Next aus dieser Datei selbst. Inhalt kommt aus brand.ts, das Bild
 * zieht also mit, wenn sich Claim oder Säulen ändern.
 *
 * Bildsprache aus dem Hero übernommen: Nachtblau, zwei Blaulicht-Scheine,
 * Horizontlinie, Verlauf nach links für die Lesbarkeit. Was Satori nicht
 * kann – Canvas-Höhenlinien, blur(), mix-blend-mode – ist weggelassen statt
 * billig nachgebaut.
 */

export const alt = `${brand.name} – ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Hero-Palette, verbatim aus Hero.tsx. */
const NIGHT = "#020406";
const INK = "#eef5ff";
const DIM = "rgba(196,222,255,0.82)";
const BLUE = "#1684f7";

/** Geometrie verbatim aus LogoMark; Ring erbt die Textfarbe, Sprig bleibt blau. */
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 1 44 63" fill="none"><circle cx="32" cy="41" r="18" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(-90 32 41)"/><g stroke="${BLUE}" stroke-width="5" stroke-linecap="round"><path d="M32 23 L32 12"/><path d="M31 14 L18 7"/><path d="M33 14 L46 7"/></g></svg>`;
const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

/** Der Schein eines Blaulichts – dieselben Stopps wie im Hero, ohne blur(). */
const glow =
  "radial-gradient(circle, rgba(80,160,255,0.55) 0%, rgba(40,110,255,0.25) 35%, rgba(20,70,220,0.08) 60%, rgba(2,4,6,0) 72%)";

export default async function Image() {
  // Gelesen statt via fetch(new URL(…, import.meta.url)): Turbopack löst das
  // unter Windows nicht auf. Das Bild wird beim Build erzeugt, cwd ist dabei
  // die Projektwurzel; für den Fall einer Auslieferung zur Laufzeit sind die
  // beiden Dateien in next.config.ts unter outputFileTracingIncludes genannt.
  const fontDir = join(process.cwd(), "src", "assets", "fonts");
  const [light, regular] = await Promise.all([
    readFile(join(fontDir, "Geist-Light.ttf")),
    readFile(join(fontDir, "Geist-Regular.ttf")),
  ]);

  const domain = new URL(brand.meta.url).host;
  const pillars = brand.pillars.map((p) => p.label).join("   ·   ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: NIGHT,
          padding: "64px 72px",
          fontFamily: "Geist",
        }}
      >
        {/* Der Lichtkörper rechts. Eng genug, dass er als Quelle liest und
            nicht als Hintergrundverlauf. */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 5,
            width: 620,
            height: 620,
            borderRadius: "50%",
            backgroundImage: glow,
          }}
        />
        {/* Gegenlicht unten links, grösstenteils angeschnitten – gibt dem
            dunklen Feld Tiefe, ohne mit der Schrift zu konkurrieren. */}
        <div
          style={{
            position: "absolute",
            left: -340,
            top: 380,
            width: 620,
            height: 620,
            borderRadius: "50%",
            backgroundImage: glow,
          }}
        />
        {/* Verlauf nach rechts, damit die Schrift links auf ruhigem Grund
            steht. Endet früh genug, dass der Lichtkörper hell bleibt. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(2,4,6,0.96) 0%, rgba(2,4,6,0.86) 30%, rgba(2,4,6,0.3) 64%, rgba(2,4,6,0) 100%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} alt="" width={78} height={112} style={{ position: "relative" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            fontSize: 82,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            color: INK,
          }}
        >
          {brand.hero.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", height: 1, backgroundColor: "rgba(22,132,247,0.2)" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 26,
              fontSize: 23,
              fontWeight: 400,
              letterSpacing: "-0.005em",
            }}
          >
            <span style={{ color: DIM }}>{pillars}</span>
            <span style={{ color: INK }}>{domain}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: light, weight: 300, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
