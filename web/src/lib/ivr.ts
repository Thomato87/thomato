/**
 * Rechenkern nach den "Richtlinien für die Organisation des Sanitätsdienstes
 * bei Veranstaltungen", Interverband für Rettungswesen IVR, Ausgabe 2017.
 *
 * Zwei Verfahren, die die Richtlinie nebeneinander empfiehlt:
 *   Maurer  – Gefahrenanalyse nach Klaus Maurer, Anhang 3-1 bis 3-3 und Anhang 4.
 *             Führend, weil nur dieses Verfahren konkrete Personalzahlen liefert.
 *   SSB     – Risikobeurteilung nach dem Postendienstreglement des
 *             Schweizerischen Samariterbundes, Anhang 2. Gegenprobe.
 *
 * Schweizer Anpassung, wie sie die Richtlinie in Ziff. 4.3 selbst verlangt:
 * Der Krankentransportwagen KTW aus Anhang 4 wird nicht ausgegeben, weil er im
 * schweizerischen Rettungswesen keine eigene Kategorie ist. Laienhelfer im Sinn
 * der Richtlinie heissen hier Samariter.
 *
 * Alle Zahlen und Schwellen stammen wörtlich aus der Richtlinie. Sie werden
 * nicht gerundet, geglättet oder ergänzt.
 */

export type Stufe = 0 | 1 | 2 | 3;

/* ─── Ausbaustufen, Ziff. 2.4 und 5 ─────────────────────────────────────── */

export const STUFEN: {
  stufe: Stufe;
  titel: string;
  /** Kurzform für die Leiter auf schmalen Schirmen. */
  mobil: string;
  /** Punktebereich, der auf diese Stufe führt. Ziff. 4.3.4. */
  bereich: string;
  kurz: string;
  beschreibung: string;
}[] = [
  {
    stufe: 0,
    titel: "Kein Sanitätsdienst",
    mobil: "Kein Dienst",
    bereich: "bis 2 Punkte",
    kurz: "Nichts vor Ort nötig",
    beschreibung:
      "Auf einen Sanitätsdienst vor Ort kann verzichtet werden. Die Alarmierung läuft im Notfall über die Sanitätsnotrufzentrale 144 wie im Alltag.",
  },
  {
    // Die Richtlinie von 2017 nennt hier noch den "Kurs Erste Hilfe SSB".
    // Bewusst ersetzt durch die heute geltende Ausbildungsstufe des IVR:
    // First Aid Stufe 2 IVR, Zielgruppe Betriebssanitäter, setzt Stufe 1
    // voraus. Bewusst mit der vollen Kursbezeichnung geschrieben und nicht als
    // "IVR-Stufe 2", weil der Rechner sein Ergebnis selbst als Stufe 1 bis 3
    // ausgibt und das die Ausbaustufe meint, nicht die Ausbildung.
    stufe: 1,
    titel: "Sanitätsposten",
    mobil: "Posten",
    bereich: "bis 4 Punkte",
    kurz: "Laienhelfer vor Ort",
    beschreibung:
      "Ein oder mehrere Sanitätsposten, jeder mit mindestens zwei Personen besetzt. Die Leitung braucht mindestens die Ausbildung First Aid Stufe 2 IVR oder eine gleichwertige Qualifikation. Bei weitläufigem Gelände kommen Patrouillen zu mindestens zwei Personen dazu.",
  },
  {
    stufe: 2,
    titel: "Posten mit Fachpersonal",
    mobil: "Fachpersonal",
    bereich: "ab 4 Punkten",
    kurz: "Verstärkt durch Profis",
    beschreibung:
      "Die Posten werden durch Rettungssanitäter und bei Bedarf durch Ärzte verstärkt. Die Verantwortung liegt beim Fachpersonal, das auch triagiert, also entscheidet, wer zuerst behandelt wird. Liegt der Ort weit von den Rettungsdiensten entfernt, kommt ein Rettungsfahrzeug mit Besatzung vor Ort dazu.",
  },
  {
    stufe: 3,
    titel: "Professionelle Einsatzleitung",
    mobil: "Einsatzleitung",
    bereich: "über 30 Punkte",
    kurz: "Eigenes Einsatzkonzept",
    beschreibung:
      "Ein individuell auf die Veranstaltung abgestimmtes Einsatzkonzept mit Einsatzleitung, Sanitätsposten, mobilen Patrouillen, Transportmitteln vor Ort und bei Bedarf einer mobilen Sanitätshilfsstelle, also einem eingerichteten Behandlungsplatz auf dem Gelände.",
  },
];

/* ─── Tabelle 2: Gefahrenneigung nach Art der Veranstaltung ─────────────── */

export interface Veranstaltungsart {
  id: string;
  label: string;
  faktor: number;
}

export const VERANSTALTUNGSARTEN: Veranstaltungsart[] = [
  { id: "allgemeine-veranstaltung", label: "Allgemeine Veranstaltung (geringes Risiko)", faktor: 0.3 },
  { id: "allgemeine-sportveranstaltung", label: "Allgemeine Sportveranstaltung", faktor: 0.3 },
  { id: "ausstellung", label: "Ausstellung", faktor: 0.3 },
  { id: "basar", label: "Basar", faktor: 0.3 },
  { id: "demonstration", label: "Demonstration", faktor: 0.8 },
  { id: "fasnachtsumzug", label: "Fasnachtsumzug", faktor: 0.7 },
  { id: "fasnachtsveranstaltung", label: "Fasnachtsveranstaltung", faktor: 0.7 },
  { id: "feuerwerk", label: "Feuerwerk", faktor: 0.4 },
  { id: "flohmarkt", label: "Flohmarkt", faktor: 0.3 },
  { id: "flugveranstaltung", label: "Flugveranstaltung", faktor: 0.9 },
  { id: "kombi-veranstaltung", label: "Kombi-Veranstaltung (Sport, Musik, Show)", faktor: 0.35 },
  { id: "konzert", label: "Konzert", faktor: 0.2 },
  { id: "kundgebung", label: "Kundgebung", faktor: 0.5 },
  { id: "motorsportveranstaltung", label: "Motorsportveranstaltung", faktor: 0.8 },
  { id: "musikveranstaltung", label: "Musikveranstaltung", faktor: 0.5 },
  { id: "oper-operette", label: "Oper oder Operette", faktor: 0.2 },
  { id: "radrennen", label: "Radrennen", faktor: 0.3 },
  { id: "reitsportveranstaltung", label: "Reitsportveranstaltung", faktor: 0.1 },
  { id: "rockkonzert", label: "Rockkonzert", faktor: 1 },
  { id: "rockkonzert-boygroup", label: "Rockkonzert mit Boygroup", faktor: 1.2 },
  { id: "schauspiel-theater", label: "Schauspiel oder Theater", faktor: 0.2 },
  { id: "schuetzenfest", label: "Schützenfest", faktor: 0.5 },
  { id: "show", label: "Show", faktor: 0.2 },
  { id: "stadtteilfest", label: "Stadtteilfest", faktor: 0.4 },
  { id: "strassenfest", label: "Strassenfest", faktor: 0.4 },
  { id: "tanzsportveranstaltung", label: "Tanzsportveranstaltung", faktor: 0.3 },
  { id: "volksfest", label: "Volksfest", faktor: 0.4 },
  { id: "volkslauf", label: "Volkslauf", faktor: 0.3 },
  { id: "weihnachtsmarkt", label: "Weihnachtsmarkt", faktor: 0.3 },
];

export function findeArt(id: string): Veranstaltungsart {
  return (
    VERANSTALTUNGSARTEN.find((a) => a.id === id) ?? VERANSTALTUNGSARTEN[0]
  );
}

/* ─── Eingaben ──────────────────────────────────────────────────────────── */

export type Ortstyp = "freigelaende" | "gebaeude";
export type Quelle = "zahl" | "flaeche";

export interface Eingaben {
  art: string;
  ort: Ortstyp;
  /** Nutzbare Fläche in Quadratmetern. Wird für beide Flächenwege genutzt. */
  flaeche: number | null;
  maxQuelle: Quelle;
  maxZahl: number | null;
  erwartetQuelle: Quelle;
  erwartetZahl: number | null;
  prominente: number;
  gewaltbereitschaft: boolean;
  /** Gegenprobe und Stufe-0-Prüfung. */
  mitwirkende: number | null;
  dauerStunden: number | null;
  fahrzeitMinuten: number | null;
  ssb: Partial<Record<SsbId, boolean>>;
}

export const LEERE_EINGABEN: Eingaben = {
  art: "allgemeine-veranstaltung",
  ort: "freigelaende",
  flaeche: null,
  maxQuelle: "zahl",
  maxZahl: null,
  erwartetQuelle: "zahl",
  erwartetZahl: null,
  prominente: 0,
  gewaltbereitschaft: false,
  mitwirkende: null,
  dauerStunden: null,
  fahrzeitMinuten: null,
  ssb: {},
};

/* ─── Anhang 3-1, Tabelle 1: maximal zulässige Besucherzahl ─────────────── */

/**
 * Bis 500 = 1 Punkt, bis 1000 = 2, bis 1500 = 3, bis 3000 = 4, bis 6000 = 5,
 * bis 10 000 = 6, bis 20 000 = 7, bis 30 000 = 8, bis 40 000 = 9,
 * bis 50 000 = 10. Für jeweils weitere 10 000 Teilnehmer ein Punkt mehr.
 */
export function punkteMaximalzahl(personen: number): number {
  if (personen <= 0) return 0;
  if (personen <= 500) return 1;
  if (personen <= 1000) return 2;
  if (personen <= 1500) return 3;
  if (personen <= 3000) return 4;
  if (personen <= 6000) return 5;
  if (personen <= 10000) return 6;
  if (personen <= 20000) return 7;
  if (personen <= 30000) return 8;
  if (personen <= 40000) return 9;
  if (personen <= 50000) return 10;
  return 10 + Math.ceil((personen - 50000) / 10000);
}

/** Anhang 3-1, Ziff. 11.2.2: ein Punkt pro volle 500 erwartete Besucher. */
export function punkteErwartungszahl(personen: number): number {
  if (personen <= 0) return 0;
  return Math.floor(personen / 500);
}

/** Rundet auf zwei Stellen, damit die Bandgrenzen der Richtlinie sauber greifen. */
function runde(wert: number): number {
  return Math.round(wert * 100) / 100;
}

/* ─── Anhang 3-3: Ermittlung des Gesamtrisikos ──────────────────────────── */

export interface MaurerErgebnis {
  /** Zeile 1: Punkte aus der maximal zulässigen Besucherzahl. */
  zeile1: number;
  zeile1Basis: number;
  zeile1AusFlaeche: boolean;
  /** Zeile 2: Verdoppelung in geschlossener baulicher Anlage. */
  zeile2: number;
  /** Zeile 3: Punkte aus der tatsächlich erwarteten Besucherzahl. */
  zeile3: number;
  zeile3Basis: number;
  zeile3AusFlaeche: boolean;
  /** Zeile 4 und 5: Bewertungsfaktor und gewichtetes Zwischenergebnis. */
  faktor: number;
  artLabel: string;
  zeile5: number;
  /** Zeile 6: Beteiligung prominenter Persönlichkeiten. */
  zeile6: number;
  /** Zeile 7: polizeiliche Erkenntnisse zur Gewaltbereitschaft. */
  zeile7: number;
  /** Zeile 8: Gesamtrisiko. */
  gesamt: number;
  stufe: Stufe;
  /** Wurde überhaupt genug eingegeben, um zu rechnen? */
  vollstaendig: boolean;
}

function personenAusFlaeche(flaeche: number | null, proQuadratmeter: number): number {
  if (!flaeche || flaeche <= 0) return 0;
  return Math.floor(flaeche * proQuadratmeter);
}

export function rechneMaurer(e: Eingaben): MaurerErgebnis {
  const art = findeArt(e.art);

  // Zeile 1: aus Auflagen und Bestuhlung, oder bei Freigelände 4 Personen je m².
  const zeile1AusFlaeche = e.maxQuelle === "flaeche";
  const zeile1Basis = zeile1AusFlaeche
    ? personenAusFlaeche(e.flaeche, 4)
    : Math.max(0, e.maxZahl ?? 0);
  const zeile1 = punkteMaximalzahl(zeile1Basis);

  // Zeile 2: in geschlossener baulicher Anlage zählt Zeile 1 ein zweites Mal.
  const zeile2 = e.ort === "gebaeude" ? zeile1 : 0;

  // Zeile 3: aus Vorverkauf und Erfahrung, oder aus Fläche mit 2 Personen je m².
  const zeile3AusFlaeche = e.erwartetQuelle === "flaeche";
  const zeile3Basis = zeile3AusFlaeche
    ? personenAusFlaeche(e.flaeche, 2)
    : Math.max(0, e.erwartetZahl ?? 0);
  const zeile3 = punkteErwartungszahl(zeile3Basis);

  // Zeile 5: (Zeile 1 + Zeile 2 + Zeile 3) mal Bewertungsfaktor.
  const zeile5 = runde((zeile1 + zeile2 + zeile3) * art.faktor);

  // Zeile 6: je 5 Prominente 10 Punkte, höchstens 30.
  const zeile6 =
    e.prominente > 0 ? Math.min(30, Math.ceil(e.prominente / 5) * 10) : 0;

  // Zeile 7: 10 Punkte bei polizeilich bekannter Gewaltbereitschaft.
  const zeile7 = e.gewaltbereitschaft ? 10 : 0;

  const gesamt = runde(zeile5 + zeile6 + zeile7);

  return {
    zeile1,
    zeile1Basis,
    zeile1AusFlaeche,
    zeile2,
    zeile3,
    zeile3Basis,
    zeile3AusFlaeche,
    faktor: art.faktor,
    artLabel: art.label,
    zeile5,
    zeile6,
    zeile7,
    gesamt,
    stufe: stufeAusPunkten(gesamt),
    vollstaendig: zeile1Basis > 0 && zeile3Basis > 0,
  };
}

/**
 * Ziff. 4.3.4: bis 2 Punkte Stufe 0, bis 4 Punkte Stufe 1, ab 4 Punkten
 * mindestens Stufe 2, mehr als 30 Punkte Stufe 3.
 *
 * Bei genau 4,0 Punkten überschneiden sich die beiden mittleren Angaben der
 * Richtlinie. Anhang 4 ordnet das Band 2,1 bis 4,0 noch der kleinen Besetzung
 * mit 1 bis 3 Samaritern zu, deshalb gehört 4,0 hier zu Stufe 1.
 */
export function stufeAusPunkten(punkte: number): Stufe {
  if (punkte <= 2) return 0;
  if (punkte <= 4) return 1;
  if (punkte <= 30) return 2;
  return 3;
}

/* ─── Anhang 4: Bemessung der notwendigen Einsatzmittel ─────────────────── */

export type Einsatzleitung = "keine" | "reduziert" | "voll";

export interface Einsatzmittel {
  /** Samariter, in der Richtlinie "Laienhelfer". Ohne Personal der
   *  Rettungsdienste, ohne Einsatzleitung, ohne Sanitätshilfsstelle. */
  samariterMin: number;
  samariterMax: number;
  rettungswagen: number;
  notaerzte: number;
  einsatzleitung: Einsatzleitung;
  /** Die Tabelle der Richtlinie endet bei 140 Punkten. */
  ueberTabelle: boolean;
}

export function rechneEinsatzmittel(punkte: number): Einsatzmittel {
  const p = runde(punkte);

  let samariterMin = 0;
  let samariterMax = 0;
  if (p <= 2) {
    samariterMin = 0;
    samariterMax = 0;
  } else if (p <= 4) {
    samariterMin = 1;
    samariterMax = 3;
  } else if (p <= 13.5) {
    samariterMin = samariterMax = 5;
  } else if (p <= 22) {
    samariterMin = samariterMax = 10;
  } else if (p <= 40) {
    samariterMin = samariterMax = 20;
  } else if (p <= 60) {
    samariterMin = samariterMax = 30;
  } else if (p <= 80) {
    samariterMin = samariterMax = 40;
  } else if (p <= 100) {
    samariterMin = samariterMax = 80;
  } else if (p <= 110) {
    samariterMin = samariterMax = 100;
  } else if (p <= 120) {
    samariterMin = samariterMax = 120;
  } else {
    samariterMin = samariterMax = 160;
  }

  // Rettungswagen RTW. Die Vorlage druckt in der vorletzten Zeile "10,1 – 120,0",
  // ein Satzfehler zwischen den Bändern 75,6 – 100,0 und "ab 120,1".
  let rettungswagen: number;
  if (p <= 6) rettungswagen = 0;
  else if (p <= 25.5) rettungswagen = 1;
  else if (p <= 45.5) rettungswagen = 2;
  else if (p <= 60.5) rettungswagen = 3;
  else if (p <= 75.5) rettungswagen = 4;
  else if (p <= 100) rettungswagen = 5;
  else if (p <= 120) rettungswagen = 6;
  else rettungswagen = 7;

  let notaerzte: number;
  if (p <= 13) notaerzte = 0;
  else if (p <= 30) notaerzte = 1;
  else if (p <= 60) notaerzte = 2;
  else if (p <= 90) notaerzte = 3;
  else if (p <= 120) notaerzte = 4;
  else notaerzte = 5;

  const einsatzleitung: Einsatzleitung =
    p <= 30 ? "keine" : p <= 60 ? "reduziert" : "voll";

  return {
    samariterMin,
    samariterMax,
    rettungswagen,
    notaerzte,
    einsatzleitung,
    ueberTabelle: p > 140,
  };
}

export const EINSATZLEITUNG_TEXT: Record<Einsatzleitung, string> = {
  keine:
    "Keine stabsmässige Einsatzleitung nötig. Eine verantwortliche Person für den Sanitätsdienst braucht es trotzdem.",
  reduziert:
    "Stabsmässige Einsatzleitung mit reduzierter Besetzung. Stabsmässig heisst, dass eine kleine Führungsequipe den Einsatz leitet und nicht eine einzelne Person nebenbei.",
  voll:
    "Volle stabsmässig strukturierte Einsatzleitung. Die organisatorische Führung übernimmt ein Einsatzleiter Sanität, die medizinische ein leitender Notarzt.",
};

/* ─── Anhang 2: Risikobeurteilung nach Postendienstreglement SSB ────────── */

export type SsbId =
  | "beteiligte-50"
  | "beteiligte-100"
  | "beteiligte-200"
  | "beteiligte-gefordert"
  | "beteiligte-amateure"
  | "beteiligte-ausbildung-tief"
  | "beteiligte-unfallrisiko"
  | "beteiligte-koerperkontakt"
  | "beteiligte-anhaeufungen"
  | "besucher-100"
  | "besucher-500"
  | "besucher-1000"
  | "besucher-5000"
  | "besucher-20000"
  | "besucher-gedraenge"
  | "besucher-gefaehrdete-gruppe"
  | "besucher-emotionen-alkohol"
  | "umfeld-grossraeumig"
  | "umfeld-hitze-sauerstoff"
  | "umfeld-gelaende"
  | "umfeld-wetter"
  | "umfeld-tageszeit";

export interface SsbFrage {
  id: SsbId;
  block: "Aktiv Beteiligte" | "Zuschauer und Besucher" | "Umfeld";
  frage: string;
  /** Wird aus den übrigen Angaben abgeleitet und nicht gefragt. */
  abgeleitet: boolean;
}

export const SSB_FRAGEN: SsbFrage[] = [
  { id: "beteiligte-50", block: "Aktiv Beteiligte", frage: "Mehr als 50 aktiv Beteiligte", abgeleitet: true },
  { id: "beteiligte-100", block: "Aktiv Beteiligte", frage: "Mehr als 100 aktiv Beteiligte", abgeleitet: true },
  { id: "beteiligte-200", block: "Aktiv Beteiligte", frage: "Mehr als 200 aktiv Beteiligte", abgeleitet: true },
  { id: "beteiligte-gefordert", block: "Aktiv Beteiligte", frage: "Sind die aktiv Beteiligten körperlich stark gefordert?", abgeleitet: false },
  { id: "beteiligte-amateure", block: "Aktiv Beteiligte", frage: "Sind die aktiv Beteiligten als Amateure tätig?", abgeleitet: false },
  { id: "beteiligte-ausbildung-tief", block: "Aktiv Beteiligte", frage: "Ist der Ausbildungs- oder Trainingsstand eher tief?", abgeleitet: false },
  { id: "beteiligte-unfallrisiko", block: "Aktiv Beteiligte", frage: "Birgt die Betätigung ein spezielles Unfallrisiko?", abgeleitet: false },
  { id: "beteiligte-koerperkontakt", block: "Aktiv Beteiligte", frage: "Besteht Körperkontakt, etwa bei Kampfsport oder Mannschaftsspielen?", abgeleitet: false },
  { id: "beteiligte-anhaeufungen", block: "Aktiv Beteiligte", frage: "Sind Anhäufungen möglich, etwa ein Fahrerfeld?", abgeleitet: false },
  { id: "besucher-100", block: "Zuschauer und Besucher", frage: "Mehr als 100 Zuschauer", abgeleitet: true },
  { id: "besucher-500", block: "Zuschauer und Besucher", frage: "Mehr als 500 Zuschauer", abgeleitet: true },
  { id: "besucher-1000", block: "Zuschauer und Besucher", frage: "Mehr als 1000 Zuschauer", abgeleitet: true },
  { id: "besucher-5000", block: "Zuschauer und Besucher", frage: "Mehr als 5000 Zuschauer", abgeleitet: true },
  { id: "besucher-20000", block: "Zuschauer und Besucher", frage: "Mehr als 20 000 Zuschauer", abgeleitet: true },
  { id: "besucher-gedraenge", block: "Zuschauer und Besucher", frage: "Ist ein grosses Gedränge möglich?", abgeleitet: false },
  { id: "besucher-gefaehrdete-gruppe", block: "Zuschauer und Besucher", frage: "Ist mit einer speziell gefährdeten Gruppe zu rechnen, etwa älteren Menschen oder Herzpatienten?", abgeleitet: false },
  { id: "besucher-emotionen-alkohol", block: "Zuschauer und Besucher", frage: "Sind besondere Emotionen oder Einfluss von Alkohol und Drogen möglich?", abgeleitet: false },
  { id: "umfeld-grossraeumig", block: "Umfeld", frage: "Ist die Veranstaltung grossräumig verteilt?", abgeleitet: false },
  { id: "umfeld-hitze-sauerstoff", block: "Umfeld", frage: "Sind besondere Einflüsse wie übermässige Hitze oder Sauerstoffmangel möglich?", abgeleitet: false },
  { id: "umfeld-gelaende", block: "Umfeld", frage: "Ist das Gelände unwegsam, rutschig oder eisig?", abgeleitet: false },
  { id: "umfeld-wetter", block: "Umfeld", frage: "Ist die Wettersituation risikosteigernd?", abgeleitet: false },
  { id: "umfeld-tageszeit", block: "Umfeld", frage: "Ist die Tageszeit risikosteigernd?", abgeleitet: false },
];

export const SSB_GEFRAGT = SSB_FRAGEN.filter((f) => !f.abgeleitet);

export interface SsbErgebnis {
  ja: number;
  stufe: Stufe;
  /** Wie viele der von Hand zu beantwortenden Fragen noch offen sind. */
  offen: number;
  abgeleitet: Partial<Record<SsbId, boolean>>;
}

export function rechneSsb(e: Eingaben, maurer: MaurerErgebnis): SsbErgebnis {
  const mitwirkende = e.mitwirkende ?? 0;
  const besucher = maurer.zeile3Basis;

  const abgeleitet: Partial<Record<SsbId, boolean>> = {
    "beteiligte-50": mitwirkende > 50,
    "beteiligte-100": mitwirkende > 100,
    "beteiligte-200": mitwirkende > 200,
    "besucher-100": besucher > 100,
    "besucher-500": besucher > 500,
    "besucher-1000": besucher > 1000,
    "besucher-5000": besucher > 5000,
    "besucher-20000": besucher > 20000,
  };

  let ja = 0;
  for (const wert of Object.values(abgeleitet)) if (wert) ja += 1;
  for (const frage of SSB_GEFRAGT) if (e.ssb[frage.id]) ja += 1;

  const offen = SSB_GEFRAGT.filter((f) => e.ssb[f.id] === undefined).length;

  return { ja, stufe: stufeAusSsb(ja), offen, abgeleitet };
}

/** Ziff. 4.2: 0 bis 4 kein Sanitätsdienst, 5 bis 6 Stufe 1, 7 bis 12 Stufe 2, ab 13 Stufe 3. */
export function stufeAusSsb(ja: number): Stufe {
  if (ja <= 4) return 0;
  if (ja <= 6) return 1;
  if (ja <= 12) return 2;
  return 3;
}

/* ─── Ziff. 4.1: kein Sanitätsdienst erforderlich ───────────────────────── */

export interface Kriterium {
  label: string;
  /** null, solange die nötige Angabe fehlt. */
  erfuellt: boolean | null;
}

export interface StufeNullPruefung {
  kriterien: Kriterium[];
  /** Alle fünf Kriterien gleichzeitig erfüllt. */
  erfuellt: boolean;
  /** Mindestens eine Angabe fehlt noch. */
  unvollstaendig: boolean;
}

export function pruefeStufeNull(
  e: Eingaben,
  maurer: MaurerErgebnis,
): StufeNullPruefung {
  const besucher = maurer.zeile3Basis;
  const kriterien: Kriterium[] = [
    {
      label: "Weniger als 1500 Besucher",
      erfuellt: besucher > 0 ? besucher < 1500 : null,
    },
    {
      label: "Kurze Dauer, bis 3 Stunden",
      erfuellt: e.dauerStunden === null ? null : e.dauerStunden <= 3,
    },
    {
      label: "Fahrzeit zur notärztlichen Versorgung höchstens 10 Minuten",
      erfuellt: e.fahrzeitMinuten === null ? null : e.fahrzeitMinuten <= 10,
    },
    {
      label: "Geringes Verletzungsrisiko",
      erfuellt:
        e.ssb["beteiligte-unfallrisiko"] === undefined
          ? null
          : !e.ssb["beteiligte-unfallrisiko"],
    },
    {
      label: "Keine Risikogruppen",
      erfuellt:
        e.ssb["besucher-gefaehrdete-gruppe"] === undefined
          ? null
          : !e.ssb["besucher-gefaehrdete-gruppe"],
    },
  ];

  return {
    kriterien,
    erfuellt: kriterien.every((k) => k.erfuellt === true),
    unvollstaendig: kriterien.some((k) => k.erfuellt === null),
  };
}

/* ─── Gesamtauswertung ──────────────────────────────────────────────────── */

export interface Auswertung {
  maurer: MaurerErgebnis;
  mittel: Einsatzmittel;
  ssb: SsbErgebnis;
  stufeNull: StufeNullPruefung;
  /** Die Stufe, die die Seite ausweist. Maurer ist führend. */
  stufe: Stufe;
  /** Weichen Maurer und die Gegenprobe voneinander ab? */
  widerspruch: boolean;
}

export function werteAus(e: Eingaben): Auswertung {
  const maurer = rechneMaurer(e);
  const mittel = rechneEinsatzmittel(maurer.gesamt);
  const ssb = rechneSsb(e, maurer);
  const stufeNull = pruefeStufeNull(e, maurer);

  return {
    maurer,
    mittel,
    ssb,
    stufeNull,
    stufe: maurer.stufe,
    widerspruch:
      maurer.vollstaendig && ssb.offen === 0 && ssb.stufe !== maurer.stufe,
  };
}

/* ─── Darstellung ───────────────────────────────────────────────────────── */

/** Schweizer Tausendertrennung mit Apostroph, wie in der Richtlinie. */
export function formatZahl(n: number): string {
  return Math.round(n).toLocaleString("de-CH").replace(/[’ .,]/g, "'");
}

/** Punktwerte mit Komma, wie in der Richtlinie, ohne unnötige Nullen. */
export function formatPunkte(n: number): string {
  const gerundet = Math.round(n * 100) / 100;
  return gerundet.toFixed(Number.isInteger(gerundet) ? 0 : Math.min(2, (String(gerundet).split(".")[1] ?? "").length)).replace(".", ",");
}
