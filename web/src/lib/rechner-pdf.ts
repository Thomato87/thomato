import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import {
  LineCapStyle,
  PDFDocument,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import {
  EINSATZLEITUNG_TEXT,
  STUFEN,
  VERANSTALTUNGSARTEN,
  formatPunkte,
  formatZahl,
  werteAus,
  type Auswertung,
  type Eingaben,
} from "@/lib/ivr";

/**
 * Erzeugt das Ergebnis-PDF zum Sanitätsdienst-Rechner.
 *
 * Das Dokument enthält bewusst dieselben Pflichthinweise wie die Seite. Es wird
 * weitergereicht, an Gemeinden und Rettungsdienste, und muss deshalb auch für
 * sich allein sagen, dass es eine Empfehlung ist und keine Auflage.
 */

const A4 = { breite: 595.28, hoehe: 841.89 };
const RAND = 54;
const SPALTE = A4.breite - RAND * 2;

const TINTE = rgb(0.008, 0.027, 0.071); // Navy #020712
const GEDAEMPFT = rgb(0.42, 0.45, 0.5);
const MARKE = rgb(0, 0.306, 0.769); // Markenblau #004ec4
const LINIE = rgb(0.84, 0.86, 0.89);
const FLAECHE = rgb(0.93, 0.95, 0.99);

/**
 * Wortmarke, Geometrie wörtlich aus `components/ui/logo.tsx` übernommen.
 *
 * Sie wird gezeichnet, nicht als Bild eingebettet: so bleibt sie in jeder
 * Grösse scharf, das PDF bleibt klein, und eine Änderung am Logo muss nur an
 * zwei Stellen nachgezogen werden statt in einer neu exportierten Bilddatei.
 *
 * Das SVG-Koordinatensystem zählt y nach unten, PDF nach oben. Umgerechnet
 * wird mit `py = y0 + (VB_MAX_Y - sy) * k`.
 */
const WORTMARKE = {
  vbX: -318,
  vbBreite: 376,
  vbMaxY: 2, // viewBox minY -82 plus Höhe 84
  vbHoehe: 84,
  schriftgrad: 100,
  laufweite: -4,
  text: "thomat",
  // Die Tomate ersetzt das letzte "o".
  frucht: { cx: 27, cy: -27, r: 21.5, staerke: 11 },
  // Stiel und die zwei Blätter, in Markenblau.
  sprossen: [
    [27, -50.7, 27, -65.2],
    [25.7, -62.6, 8.6, -71.8],
    [28.3, -62.6, 45.4, -71.8],
  ] as const,
  sprossenStaerke: 11,
} as const;

/**
 * Bildmarke, Geometrie wörtlich aus `components/ui/logo.tsx`, viewBox "10 1 44 63".
 * Die Frucht als offener Ring, darüber Stiel und zwei Blätter.
 */
const BILDMARKE = {
  frucht: { cx: 32, cy: 41, r: 18, staerke: 5 },
  sprossen: [
    [32, 23, 32, 12],
    [31, 14, 18, 7],
    [33, 14, 46, 7],
  ] as const,
  sprossenStaerke: 5,
} as const;

/**
 * Legt die Bildmarke gross und blass in die rechte untere Ecke.
 *
 * Zwei Dinge, die hier nicht offensichtlich sind:
 *
 * Erstens wird die Marke als **ein** Pfad in **einem** Strichgang gezeichnet.
 * Zeichnet man Kreis und Sprossen einzeln, addiert sich die Deckkraft dort, wo
 * sie sich überlagern, und der Stielansatz wird sichtbar dunkler als der Rest.
 * Ein einziger Strich färbt jede Fläche genau einmal.
 *
 * Zweitens muss der Aufruf erfolgen, **bevor** Inhalt auf die Seite kommt:
 * pdf-lib hängt Zeichenbefehle in Aufrufreihenfolge an, es gibt kein
 * Voranstellen. Deshalb ruft `Satz` das beim Anlegen jeder Seite auf.
 */
function wasserzeichen(seite: PDFPage) {
  const m = BILDMARKE;
  const k = 9.1;
  const { cx, cy, r } = m.frucht;

  // Die Frucht als zwei Halbbögen, damit sie Teil desselben Pfades bleibt.
  const pfad = [
    `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}`,
    ...m.sprossen.map(([ax, ay, bx, by]) => `M${ax} ${ay}L${bx} ${by}`),
  ].join("");

  // Der Mittelpunkt der Frucht liegt genau auf der Ecke. Sichtbar bleibt damit
  // ein Viertel des Kreises, und vom Stiel, der senkrecht darüber steht, die
  // linke Hälfte. `drawSvgPath` zählt y nach unten, passend zum Quelltext.
  seite.drawSvgPath(pfad, {
    x: A4.breite - cx * k,
    y: cy * k,
    scale: k,
    borderColor: MARKE,
    // Achtung: pdf-lib setzt die Strichstärke erst nach der Skalierung, sie
    // zählt also in Pfad-Einheiten. Hier nicht zusätzlich mit k multiplizieren,
    // sonst wird der Strich um das Quadrat des Faktors zu dick und die Frucht
    // erscheint als gefüllte Scheibe.
    borderWidth: m.sprossenStaerke,
    borderOpacity: 0.08,
    borderLineCap: LineCapStyle.Round,
  });
}

type Schriften = { leicht: PDFFont; normal: PDFFont };

/** Bricht Text auf die verfügbare Breite um, gemessen an der echten Schrift. */
function umbrechen(
  text: string,
  font: PDFFont,
  groesse: number,
  breite: number,
): string[] {
  const zeilen: string[] = [];
  for (const absatz of text.split("\n")) {
    let zeile = "";
    for (const wort of absatz.split(/\s+/).filter(Boolean)) {
      const versuch = zeile ? `${zeile} ${wort}` : wort;
      if (font.widthOfTextAtSize(versuch, groesse) <= breite) {
        zeile = versuch;
      } else {
        if (zeile) zeilen.push(zeile);
        zeile = wort;
      }
    }
    zeilen.push(zeile);
  }
  return zeilen;
}

/** Kleiner Satzspiegel mit Seitenumbruch. pdf-lib bringt keinen mit. */
class Satz {
  private doc: PDFDocument;
  private f: Schriften;
  private seite: PDFPage;
  private y: number;

  constructor(doc: PDFDocument, f: Schriften) {
    this.doc = doc;
    this.f = f;
    this.seite = this.neueSeite();
    this.y = A4.hoehe - RAND;
  }

  /** Einziger Ort, an dem Seiten entstehen. Legt den Hintergrund gleich mit an. */
  private neueSeite(): PDFPage {
    const seite = this.doc.addPage([A4.breite, A4.hoehe]);
    wasserzeichen(seite);
    return seite;
  }

  /** Hält einen Block zusammen: bricht vorher um, wenn er nicht mehr passt. */
  reserviere(hoehe: number) {
    this.platz(hoehe);
  }

  private platz(hoehe: number) {
    if (this.y - hoehe < RAND + 28) {
      this.seite = this.neueSeite();
      this.y = A4.hoehe - RAND;
    }
  }

  luft(h: number) {
    this.y -= h;
  }

  get position() {
    return this.y;
  }

  linie(farbe: RGB = LINIE, staerke = 0.75) {
    this.platz(10);
    this.seite.drawLine({
      start: { x: RAND, y: this.y },
      end: { x: RAND + SPALTE, y: this.y },
      thickness: staerke,
      color: farbe,
    });
    this.y -= 1;
  }

  text(
    inhalt: string,
    opt: {
      groesse?: number;
      font?: PDFFont;
      farbe?: RGB;
      zeilenhoehe?: number;
      breite?: number;
      x?: number;
    } = {},
  ) {
    const groesse = opt.groesse ?? 9.5;
    const font = opt.font ?? this.f.normal;
    const farbe = opt.farbe ?? TINTE;
    const zh = opt.zeilenhoehe ?? groesse * 1.45;
    const breite = opt.breite ?? SPALTE;
    const x = opt.x ?? RAND;

    for (const zeile of umbrechen(inhalt, font, groesse, breite)) {
      this.platz(zh);
      this.y -= groesse;
      this.seite.drawText(zeile, { x, y: this.y, size: groesse, font, color: farbe });
      this.y -= zh - groesse;
    }
  }

  /**
   * Setzt die Wortmarke an der aktuellen Position, linksbündig am Rand.
   *
   * `hoehe` meint die volle Höhe der viewBox, also einschliesslich der Blätter
   * über der Frucht, nicht die Schriftgrösse.
   */
  wortmarke(hoehe: number, farbe: RGB = TINTE) {
    const w = WORTMARKE;
    const k = hoehe / w.vbHoehe;
    this.platz(hoehe);
    this.y -= hoehe;
    const x0 = RAND;
    const y0 = this.y;
    const px = (sx: number) => x0 + (sx - w.vbX) * k;
    const py = (sy: number) => y0 + (w.vbMaxY - sy) * k;

    // "thomat". pdf-lib kennt keine Laufweite, also Buchstabe für Buchstabe.
    const grad = w.schriftgrad * k;
    const spatium = w.laufweite * k;
    const zeichen = [...w.text];
    const breiten = zeichen.map((z) => this.f.normal.widthOfTextAtSize(z, grad));
    // Rechtsbündig an sx = 0. Der Browser rechnet die Laufweite auch hinter dem
    // letzten Zeichen mit, sonst sässe die Frucht 4 Einheiten zu weit links.
    const vorschub = breiten.reduce((a, b) => a + b, 0) + spatium * zeichen.length;
    let x = px(0) - vorschub;
    const grundlinie = py(0);
    for (let i = 0; i < zeichen.length; i++) {
      this.seite.drawText(zeichen[i], {
        x,
        y: grundlinie,
        size: grad,
        font: this.f.normal,
        color: farbe,
      });
      x += breiten[i] + spatium;
    }

    // Die Frucht, ein offener Ring in der Tinte der Wortmarke.
    this.seite.drawCircle({
      x: px(w.frucht.cx),
      y: py(w.frucht.cy),
      size: w.frucht.r * k,
      borderColor: farbe,
      borderWidth: w.frucht.staerke * k,
    });

    // Stiel und Blätter, immer in Markenblau.
    for (const [ax, ay, bx, by] of w.sprossen) {
      this.seite.drawLine({
        start: { x: px(ax), y: py(ay) },
        end: { x: px(bx), y: py(by) },
        thickness: w.sprossenStaerke * k,
        color: MARKE,
        lineCap: LineCapStyle.Round,
      });
    }
  }

  /** Text rechtsbündig an der Spaltenkante. */
  rechts(inhalt: string, y: number, opt: { groesse?: number; font?: PDFFont; farbe?: RGB } = {}) {
    const groesse = opt.groesse ?? 9.5;
    const font = opt.font ?? this.f.normal;
    const breite = font.widthOfTextAtSize(inhalt, groesse);
    this.seite.drawText(inhalt, {
      x: RAND + SPALTE - breite,
      y,
      size: groesse,
      font,
      color: opt.farbe ?? TINTE,
    });
  }

  ueberschrift(inhalt: string) {
    this.luft(20);
    this.text(inhalt, { groesse: 12.5, font: this.f.normal, farbe: TINTE });
    this.luft(4);
    this.linie();
    this.luft(8);
  }

  /** Eine Zeile Begriff links, Wert rechts, mit Haarlinie darüber. */
  zeile(begriff: string, wert: string, detail?: string) {
    this.platz(detail ? 44 : 22);
    this.linie();
    this.luft(7);
    const y = this.y - 9.5;
    this.seite.drawText(begriff, {
      x: RAND,
      y,
      size: 9.5,
      font: this.f.normal,
      color: TINTE,
    });
    this.rechts(wert, y, { groesse: 11, font: this.f.leicht });
    this.y -= 9.5 + 5;
    if (detail) {
      this.text(detail, { groesse: 8, farbe: GEDAEMPFT, breite: SPALTE - 90 });
    }
    this.luft(6);
  }

  /** Farbig hinterlegter Kasten, für die Pflichthinweise. */
  kasten(titel: string, punkte: string[]) {
    const zeilen = punkte.flatMap((p) =>
      umbrechen(p, this.f.normal, 8.5, SPALTE - 32),
    );
    const hoehe = 30 + zeilen.length * 12.5 + punkte.length * 6 + 12;
    this.platz(hoehe);
    this.seite.drawRectangle({
      x: RAND,
      y: this.y - hoehe,
      width: SPALTE,
      height: hoehe,
      color: FLAECHE,
      borderColor: LINIE,
      borderWidth: 0.75,
    });
    const merker = this.y;
    this.y -= 16;
    this.text(titel, { groesse: 10, x: RAND + 16, breite: SPALTE - 32 });
    this.luft(4);
    for (const p of punkte) {
      this.text(p, {
        groesse: 8.5,
        zeilenhoehe: 12.5,
        farbe: TINTE,
        x: RAND + 16,
        breite: SPALTE - 32,
      });
      this.luft(6);
    }
    this.y = merker - hoehe;
  }
}

function artLabel(id: string): string {
  return VERANSTALTUNGSARTEN.find((a) => a.id === id)?.label ?? id;
}

function eingabeZeilen(e: Eingaben, a: Auswertung): [string, string][] {
  const zeilen: [string, string][] = [
    ["Art der Veranstaltung", artLabel(e.art)],
    ["Ort", e.ort === "gebaeude" ? "In einem Gebäude" : "Im Freien"],
    [
      "Platzangebot",
      a.maurer.zeile1AusFlaeche
        ? `${formatZahl(a.maurer.zeile1Basis)} Personen, aus ${formatZahl(e.flaeche ?? 0)} m² mit 4 Personen je m²`
        : `${formatZahl(a.maurer.zeile1Basis)} Personen`,
    ],
    [
      "Erwartete Besucher",
      a.maurer.zeile3AusFlaeche
        ? `${formatZahl(a.maurer.zeile3Basis)} Personen, aus ${formatZahl(e.flaeche ?? 0)} m² mit 2 Personen je m²`
        : `${formatZahl(a.maurer.zeile3Basis)} Personen`,
    ],
  ];
  if (e.prominente > 0) {
    zeilen.push(["Prominente Persönlichkeiten", `${e.prominente}`]);
  }
  if (e.gewaltbereitschaft) {
    zeilen.push(["Polizeiliche Erkenntnisse", "Gewaltbereitschaft erwartet"]);
  }
  if (e.mitwirkende !== null) {
    zeilen.push(["Aktiv Mitwirkende", `${formatZahl(e.mitwirkende)} Personen`]);
  }
  if (e.dauerStunden !== null) {
    zeilen.push(["Dauer", `${e.dauerStunden} Stunden`]);
  }
  if (e.fahrzeitMinuten !== null) {
    zeilen.push(["Fahrzeit zur notärztlichen Versorgung", `${e.fahrzeitMinuten} Minuten`]);
  }
  return zeilen;
}

export async function baueRechnerPdf(
  eingaben: Eingaben,
  bezeichnung?: string,
): Promise<Uint8Array> {
  // Serverseitig neu gerechnet. Zahlen aus dem Browser werden nie übernommen.
  const a = werteAus(eingaben);
  const stufe = STUFEN[a.stufe];

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fontDir = join(process.cwd(), "src", "assets", "fonts");
  const [leichtBytes, normalBytes] = await Promise.all([
    readFile(join(fontDir, "Geist-Light.ttf")),
    readFile(join(fontDir, "Geist-Regular.ttf")),
  ]);
  const f: Schriften = {
    leicht: await doc.embedFont(leichtBytes, { subset: true }),
    normal: await doc.embedFont(normalBytes, { subset: true }),
  };

  doc.setTitle("Sanitätsdienst-Rechner – Empfehlung");
  doc.setAuthor("Thomato");
  doc.setSubject(
    "Empfehlung für die Ausbaustufe des Sanitätsdienstes nach IVR-Richtlinie",
  );
  doc.setCreator("thomato.ch/sanitaetsdienst-rechner");

  const s = new Satz(doc, f);
  const datum = new Date().toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ─── Kopf ───────────────────────────────────────────────────────────────
  s.wortmarke(15);
  s.luft(6);
  s.text("Sanitätsdienst-Rechner", { groesse: 8.5, farbe: GEDAEMPFT });
  s.luft(10);
  s.linie(TINTE, 1);
  s.luft(22);

  if (bezeichnung) {
    s.text(bezeichnung, { groesse: 9.5, farbe: GEDAEMPFT });
    s.luft(4);
  }
  s.text("Empfehlung für den Sanitätsdienst", { groesse: 22, font: f.leicht });
  s.luft(6);
  s.text(
    `Erstellt am ${datum} auf thomato.ch/sanitaetsdienst-rechner, nach den Richtlinien des Interverbands für Rettungswesen IVR, Ausgabe 2017, und der Gefahrenanalyse nach Klaus Maurer.`,
    { groesse: 8.5, farbe: GEDAEMPFT },
  );
  s.luft(20);

  // ─── Befund ─────────────────────────────────────────────────────────────
  s.linie(TINTE, 1);
  s.luft(14);
  s.text(`Stufe ${a.stufe}`, { groesse: 30, font: f.leicht, farbe: MARKE });
  s.luft(2);
  s.text(stufe.titel, { groesse: 14, font: f.leicht, farbe: TINTE });
  s.luft(8);
  s.text(stufe.beschreibung, { groesse: 9, farbe: GEDAEMPFT });
  s.luft(10);
  s.linie();
  s.luft(8);
  const yPunkte = s.position - 9.5;
  s.text("Gesamtrisiko nach Maurer", { groesse: 9, farbe: GEDAEMPFT });
  s.rechts(`${formatPunkte(a.maurer.gesamt)} Punkte`, yPunkte, { groesse: 9 });
  s.luft(6);

  // ─── Bedarf ─────────────────────────────────────────────────────────────
  s.ueberschrift("Bedarf an Personal und Mitteln");
  const samariter =
    a.mittel.samariterMin === 0
      ? "keine"
      : a.mittel.samariterMin === a.mittel.samariterMax
        ? `${a.mittel.samariterMin}`
        : `${a.mittel.samariterMin} bis ${a.mittel.samariterMax}`;

  s.zeile(
    "Samariter",
    samariter,
    "Instruierte Samariter und vergleichbar ausgebildete medizinische Hilfskräfte. Ohne Personal der Rettungsdienste, ohne Einsatzleitung, ohne Sanitätshilfsstelle.",
  );
  s.zeile(
    "Rettungswagen",
    a.mittel.rettungswagen === 0 ? "keiner" : `${a.mittel.rettungswagen}`,
    "Einsatzbereit vor Ort, zusätzlich zur ordentlichen Versorgung in der Region.",
  );
  s.zeile(
    "Notärzte",
    a.mittel.notaerzte === 0 ? "keiner" : `${a.mittel.notaerzte}`,
    "Notärzte oder Notarzteinsatzfahrzeuge. Je nach Art der Veranstaltung können auch Ärzte mit notfallmedizinischen Kompetenzen vollwertige Dienste leisten.",
  );
  s.zeile(
    "Einsatzleitung",
    a.mittel.einsatzleitung === "keine"
      ? "keine"
      : a.mittel.einsatzleitung === "reduziert"
        ? "reduziert"
        : "voll",
    EINSATZLEITUNG_TEXT[a.mittel.einsatzleitung],
  );
  s.linie();
  s.luft(10);
  if (a.mittel.rettungswagen >= 1) {
    s.text(
      "Ab einem Rettungswagen gehören die Sanitätstrupps mit Fachpersonal verstärkt. Die Zahl der Samariter oben deckt das nicht ab, sie zählt ausdrücklich ohne Personal der Rettungsdienste. Rettungssanitäter und, je nach Lage, Ärzte kommen zusätzlich dazu. Genau das meint die Ausbaustufe 2 der Richtlinie: Sanitätsposten, verstärkt durch Fachpersonal, das die Verantwortung und die Triage übernimmt.",
      { groesse: 8.5, farbe: TINTE },
    );
    s.luft(10);
  }
  s.text(
    "Der Krankentransportwagen KTW, den die deutsche Vorlage an dieser Stelle ausweist, fehlt bewusst. Er ist im schweizerischen Rettungswesen keine eigene Kategorie. Die Richtlinie verlangt in Ziff. 4.3 ausdrücklich, die Bemessung an die schweizerischen Strukturen anzupassen.",
    { groesse: 8, farbe: GEDAEMPFT },
  );
  if (a.mittel.ueberTabelle) {
    s.luft(6);
    s.text(
      `Die Veranstaltung liegt mit ${formatPunkte(a.maurer.gesamt)} Punkten über dem Bereich, den die Tabelle der Richtlinie abdeckt. Sie endet bei 140 Punkten. Die Zahlen sind deshalb Untergrenzen.`,
      { groesse: 8, farbe: GEDAEMPFT },
    );
  }

  // ─── Pflichthinweise ────────────────────────────────────────────────────
  s.luft(24);
  s.kasten("Was dieses Ergebnis ist und was nicht", [
    "Es ist eine Empfehlung anhand der aktuellen Richtlinien des Interverbands für Rettungswesen IVR. Es ist keine verbindliche Vorgabe und keine behördliche Auflage. Die Richtlinien haben ausdrücklich Empfehlungscharakter.",
    "Die Berechnung orientiert sich an der Formel von Maurer. Deren Ergebnisse müssen laut Richtlinie anhand der individuellen Gegebenheiten überprüft und wo nötig angepasst werden.",
    "Das Ergebnis muss zwingend mit dem regionalen Rettungsdienst und den Bestimmungen der Gemeinde abgestimmt werden. Die Bewilligungsbehörde kann eigene Auflagen festlegen, und diese gehen vor. Nehmen Sie früh Kontakt auf, in der Regel mindestens drei Monate vorher, bei Grossanlässen sechs.",
  ]);

  // ─── Angaben ────────────────────────────────────────────────────────────
  s.ueberschrift("Angaben, auf denen die Rechnung beruht");
  for (const [begriff, wert] of eingabeZeilen(eingaben, a)) {
    s.zeile(begriff, wert);
  }
  s.linie();

  // ─── Rechenweg ──────────────────────────────────────────────────────────
  s.ueberschrift("Rechenweg nach Anhang 3-3 der Richtlinie");
  const m = a.maurer;
  const rechenweg: [string, string, string][] = [
    [
      "1",
      "Maximal zulässige Besucherzahl",
      `${formatZahl(m.zeile1Basis)} Personen → ${m.zeile1}`,
    ],
    [
      "2",
      "Verdoppelung in geschlossener baulicher Anlage",
      m.zeile2 > 0 ? `Zeile 1 zählt doppelt → ${m.zeile2}` : "Im Freien → 0",
    ],
    [
      "3",
      "Tatsächlich erwartete Besucherzahl",
      `${formatZahl(m.zeile3Basis)} Personen, ein Punkt je volle 500 → ${m.zeile3}`,
    ],
    ["4", "Bewertungsfaktor nach Art der Veranstaltung", `${m.artLabel} → × ${formatPunkte(m.faktor)}`],
    [
      "5",
      "Gewichtetes Zwischenergebnis",
      `(${m.zeile1} + ${m.zeile2} + ${m.zeile3}) × ${formatPunkte(m.faktor)} → ${formatPunkte(m.zeile5)}`,
    ],
    [
      "6",
      "Beteiligung prominenter Persönlichkeiten",
      m.zeile6 > 0 ? `Je 5 Prominente 10 Punkte → ${m.zeile6}` : "Keine → 0",
    ],
    [
      "7",
      "Polizeiliche Erkenntnisse",
      m.zeile7 > 0 ? "Gewaltbereitschaft → 10" : "Keine → 0",
    ],
  ];
  for (const [nr, was, grundlage] of rechenweg) {
    const teile = grundlage.split("→");
    const punkte = teile.pop()!.trim();
    s.zeile(`${nr}   ${was}`, punkte, teile.join("→").trim());
  }
  s.reserviere(70);
  s.linie(TINTE, 1);
  s.luft(7);
  const yTotal = s.position - 10;
  s.text("8   Gesamtrisiko", { groesse: 10 });
  s.rechts(formatPunkte(m.gesamt), yTotal, { groesse: 12, font: f.leicht });
  s.luft(12);
  s.text(
    `Vom Punktwert zur Ausbaustufe, Ziff. 4.3.4: bis 2 Punkte Stufe 0, bis 4 Punkte Stufe 1, ab 4 Punkten mindestens Stufe 2, mehr als 30 Punkte Stufe 3. ${formatPunkte(m.gesamt)} Punkte ergeben Stufe ${a.stufe}. Der Bedarf an Personal und Mitteln stammt aus Anhang 4.`,
    { groesse: 8, farbe: GEDAEMPFT },
  );

  // ─── Gegenprobe, nur wenn vollständig beantwortet ───────────────────────
  if (a.ssb.offen === 0) {
    s.ueberschrift("Gegenprobe nach dem Samariterbund");
    s.zeile("Ja-Antworten von 22", `${a.ssb.ja}`);
    s.zeile("Ausbaustufe nach diesem Weg", `${a.ssb.stufe}`);
    s.linie();
    s.luft(8);
    s.text(
      a.widerspruch
        ? `Die beiden Verfahren kommen zu unterschiedlichen Ergebnissen: Maurer auf Stufe ${a.maurer.stufe}, der Samariterbund-Fragebogen auf Stufe ${a.ssb.stufe}. Die Richtlinie hält fest, dass die Risikobeurteilung nicht nach einem festen Schema erfolgen kann. Nehmen Sie im Zweifel die höhere Stufe als Ausgangspunkt für das Gespräch.`
        : `Beide Verfahren kommen auf Stufe ${a.ssb.stufe}. Das stützt das Ergebnis.`,
      { groesse: 8.5, farbe: GEDAEMPFT },
    );
  }

  // ─── Angebot ────────────────────────────────────────────────────────────
  s.luft(24);
  s.kasten("Für das ausgeschriebene Konzept nehmen Sie mit Thomato Kontakt auf", [
    "Dieses Dokument nennt die Ausbaustufe und den Bedarf an Personal und Mitteln. Was eine Bewilligungsbehörde verlangt, ist in aller Regel mehr: ein ausgeschriebenes Sanitätskonzept mit Lageplan und Standort des Sanitätspostens, Alarmierungsablauf, freizuhaltenden Zufahrten für die Rettungsmittel, der Absprache mit dem regionalen Rettungsdienst und der Polizei sowie einer Risikobeurteilung, die auf Ihre Veranstaltung passt.",
    "Genau das erstellt Thomato für Sie, ausgehend von dieser Berechnung. Ein Sanitätskonzept kostet je nach Umfang der Veranstaltung CHF 450 bis 900. Schreiben Sie an info@thomato.ch oder über das Formular auf thomato.ch.",
  ]);

  // ─── Fuss auf jeder Seite ───────────────────────────────────────────────
  const seiten = doc.getPages();
  seiten.forEach((seite, i) => {
    seite.drawLine({
      start: { x: RAND, y: RAND + 18 },
      end: { x: RAND + SPALTE, y: RAND + 18 },
      thickness: 0.75,
      color: LINIE,
    });
    seite.drawText("thomato.ch/sanitaetsdienst-rechner", {
      x: RAND,
      y: RAND + 6,
      size: 7.5,
      font: f.normal,
      color: GEDAEMPFT,
    });
    const nr = `Seite ${i + 1} von ${seiten.length}`;
    seite.drawText(nr, {
      x: RAND + SPALTE - f.normal.widthOfTextAtSize(nr, 7.5),
      y: RAND + 6,
      size: 7.5,
      font: f.normal,
      color: GEDAEMPFT,
    });
  });

  return doc.save();
}

/** Kurzfassung für die Benachrichtigung an Thomato. */
export function kurzfassung(eingaben: Eingaben): string {
  const a = werteAus(eingaben);
  return [
    `Stufe ${a.stufe}, ${STUFEN[a.stufe].titel}`,
    `Gesamtrisiko ${formatPunkte(a.maurer.gesamt)} Punkte`,
    `Art: ${artLabel(eingaben.art)}`,
    `Ort: ${eingaben.ort === "gebaeude" ? "In einem Gebäude" : "Im Freien"}`,
    `Platzangebot: ${formatZahl(a.maurer.zeile1Basis)} Personen`,
    `Erwartet: ${formatZahl(a.maurer.zeile3Basis)} Personen`,
  ].join("\n");
}
