import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/data/brand";
import { rechner } from "@/data/rechner";

/**
 * Vorschaubild der Rechner-Seite (1200×630).
 *
 * Eigenes Bild statt des geerbten von der Startseite: Der Rechner wird
 * verschickt und verlinkt, und dann soll im Vorschaufenster stehen, was er
 * kann, nicht der Claim der Firma.
 *
 * Bildsprache und Palette sind aus `app/opengraph-image.tsx` übernommen, dort
 * stehen sie verbatim aus dem Hero. Bewusst dupliziert statt geteilt: Satori
 * rendert beide Dateien unabhängig, und ein gemeinsames Modul brächte hier nur
 * eine Abhängigkeit ohne Nutzen.
 */

export const alt = `${rechner.name} – ${rechner.titel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NIGHT = "#020406";
const INK = "#eef5ff";
const DIM = "rgba(196,222,255,0.82)";
const BLUE = "#1684f7";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 1 44 63" fill="none"><circle cx="32" cy="41" r="18" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(-90 32 41)"/><g stroke="${BLUE}" stroke-width="5" stroke-linecap="round"><path d="M32 23 L32 12"/><path d="M31 14 L18 7"/><path d="M33 14 L46 7"/></g></svg>`;
const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

const glow =
  "radial-gradient(circle, rgba(80,160,255,0.55) 0%, rgba(40,110,255,0.25) 35%, rgba(20,70,220,0.08) 60%, rgba(2,4,6,0) 72%)";

/** Von Hand umbrochen, damit die Frage in zwei Zeilen ruhig steht. */
const zeilen = ["Wie viel Sanitätsdienst", "braucht Ihre Veranstaltung?"];

export default async function Image() {
  const fontDir = join(process.cwd(), "src", "assets", "fonts");
  const [light, regular] = await Promise.all([
    readFile(join(fontDir, "Geist-Light.ttf")),
    readFile(join(fontDir, "Geist-Regular.ttf")),
  ]);

  const adresse = `${new URL(brand.meta.url).host}${rechner.pfad}`;

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(2,4,6,0.96) 0%, rgba(2,4,6,0.86) 30%, rgba(2,4,6,0.3) 64%, rgba(2,4,6,0) 100%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={markSrc}
          alt=""
          width={78}
          height={112}
          style={{ position: "relative" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            fontSize: 70,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            color: INK,
          }}
        >
          {zeilen.map((zeile) => (
            <span key={zeile}>{zeile}</span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(22,132,247,0.2)",
            }}
          />
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
            <span style={{ color: DIM }}>
              Kostenloser Rechner nach IVR-Richtlinie
            </span>
            <span style={{ color: INK }}>{adresse}</span>
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
