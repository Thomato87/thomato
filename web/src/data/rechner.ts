import { brand } from "@/data/brand";

/**
 * Angaben zum Sanitätsdienst-Rechner unter /sanitatsdienstrechner.
 * Getrennt von brand.ts, weil es eine Unterseite beschreibt und nicht die Marke.
 */
export const rechner = {
  pfad: "/sanitatsdienstrechner",
  name: "Sanitätsdienst-Rechner",

  titel:
    "Sanitätsdienst-Rechner – Bedarf für Veranstaltungen nach IVR-Richtlinie",
  beschreibung:
    "Berechnen Sie ohne Vorkenntnisse, wie viel Sanitätspersonal Ihre Veranstaltung in der Schweiz braucht. Nach den Richtlinien des Interverbands für Rettungswesen IVR und der Gefahrenanalyse nach Maurer.",
  schluesselwoerter:
    "Sanitätsdienst, Veranstaltung, IVR, Maurer, Ausbaustufe, Samariter, Rettungsdienst, Schweiz, Bewilligung, Risikoanalyse, Sanitätsposten",

  quelle: {
    titel:
      "Richtlinien für die Organisation des Sanitätsdienstes bei Veranstaltungen",
    herausgeber: "Interverband für Rettungswesen IVR",
    ausgabe: "Ausgabe 2017",
    url: "https://www.ivr-ias.ch",
  },
} as const;

export const rechnerUrl = `${brand.meta.url}${rechner.pfad}`;
