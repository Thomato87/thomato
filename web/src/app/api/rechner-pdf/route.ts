import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { STUFEN, VERANSTALTUNGSARTEN, formatPunkte, werteAus } from "@/lib/ivr";
import { baueRechnerPdf, kurzfassung } from "@/lib/rechner-pdf";

// Das PDF liest die Schriftdateien vom Dateisystem, also Node und nicht Edge.
export const runtime = "nodejs";

const artIds = VERANSTALTUNGSARTEN.map((a) => a.id) as [string, ...string[]];
const zahl = (max: number) => z.number().int().min(0).max(max).nullable();

const schema = z.object({
  email: z.string().email().max(200),
  bezeichnung: z.string().max(120).optional(),
  einwilligung: z.boolean().optional(),
  // Unsichtbares Feld. Wird es ausgefüllt, war es kein Mensch. Bewusst ohne
  // Längenprüfung: die Ablehnung erfolgt weiter unten stillschweigend, damit
  // eine Fehlermeldung nicht verrät, woran es lag.
  falle: z.string().max(500).optional(),
  eingaben: z.object({
    art: z.enum(artIds),
    ort: z.enum(["freigelaende", "gebaeude"]),
    flaeche: zahl(10_000_000),
    maxQuelle: z.enum(["zahl", "flaeche"]),
    maxZahl: zahl(10_000_000),
    erwartetQuelle: z.enum(["zahl", "flaeche"]),
    erwartetZahl: zahl(10_000_000),
    prominente: z.number().int().min(0).max(999),
    gewaltbereitschaft: z.boolean(),
    mitwirkende: zahl(1_000_000),
    dauerStunden: zahl(1000),
    fahrzeitMinuten: zahl(1000),
    ssb: z.record(z.string(), z.boolean()),
  }),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const daten = schema.parse(await request.json());

    if (daten.falle) {
      // Stillschweigend als Erfolg quittieren, damit ein Bot nichts lernt.
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Die Zahlen werden hier neu gerechnet. Was der Browser geschickt hat,
    // sind ausschliesslich die Eingaben, nie das Ergebnis.
    const eingaben = daten.eingaben;
    const auswertung = werteAus(eingaben);

    if (!auswertung.maurer.vollstaendig) {
      return NextResponse.json(
        { error: "Unvollständige Angaben" },
        { status: 400 },
      );
    }

    const pdf = await baueRechnerPdf(eingaben, daten.bezeichnung);
    const anhang = {
      filename: "Sanitaetsdienst-Empfehlung.pdf",
      content: Buffer.from(pdf).toString("base64"),
    };

    const stufe = STUFEN[auswertung.stufe];
    const betreff = `Ihre Empfehlung: Stufe ${auswertung.stufe}, ${stufe.titel}`;

    // NOTE: thomato.ch muss in Resend verifiziert sein (DNS-Records), sonst
    // schlaegt der Versand von noreply@thomato.ch fehl. Gleiche Lage wie beim
    // Kontaktformular.
    const { error: fehlerKunde } = await resend.emails.send({
      from: "Thomato <noreply@thomato.ch>",
      to: daten.email,
      replyTo: "info@thomato.ch",
      subject: betreff,
      text: [
        daten.bezeichnung ? `${daten.bezeichnung}` : null,
        `Ihre Berechnung ergibt Stufe ${auswertung.stufe}, ${stufe.titel}, bei ${formatPunkte(auswertung.maurer.gesamt)} Risikopunkten nach Maurer.`,
        ``,
        `Das vollständige Ergebnis mit Rechenweg liegt als PDF bei.`,
        ``,
        `Wichtig: Das Ergebnis ist eine Empfehlung anhand der Richtlinien des`,
        `Interverbands für Rettungswesen IVR, keine verbindliche Vorgabe und`,
        `keine behördliche Auflage. Es muss zwingend mit dem regionalen`,
        `Rettungsdienst und den Bestimmungen Ihrer Gemeinde abgestimmt werden.`,
        ``,
        `Fragen zum Ergebnis? Antworten Sie einfach auf diese Mail.`,
        ``,
        `Thomato, Digitale Lösungen und Notfallorganisation`,
        `https://thomato.ch`,
      ]
        .filter((z) => z !== null)
        .join("\n"),
      attachments: [anhang],
    });
    if (fehlerKunde) {
      throw new Error(`Resend: ${fehlerKunde.message}`);
    }

    // Benachrichtigung an Thomato. Hier laufen die Adressen zusammen.
    const { error: fehlerBenachrichtigung } = await resend.emails.send({
      from: "Thomato <noreply@thomato.ch>",
      to: "info@thomato.ch",
      replyTo: daten.email,
      subject: `Rechner genutzt: Stufe ${auswertung.stufe}${daten.bezeichnung ? ` – ${daten.bezeichnung}` : ""}`,
      text: [
        `E-Mail:       ${daten.email}`,
        `Veranstaltung: ${daten.bezeichnung || "—"}`,
        `Kontakt erlaubt: ${daten.einwilligung ? "ja, ausdrücklich zugestimmt" : "nein, nur PDF-Versand"}`,
        ``,
        kurzfassung(eingaben),
        ``,
        daten.einwilligung
          ? `Diese Person hat dem Kontakt zu ihrem Anlass zugestimmt.`
          : `Ohne Zustimmung. Diese Adresse darf nicht für Werbung genutzt werden.`,
      ].join("\n"),
      attachments: [anhang],
    });
    if (fehlerBenachrichtigung) {
      throw new Error(`Resend: ${fehlerBenachrichtigung.message}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ungültige Angaben", details: error.issues },
        { status: 400 },
      );
    }
    console.error("[rechner-pdf] Fehler:", error);
    return NextResponse.json(
      { error: "Der Versand hat nicht geklappt" },
      { status: 500 },
    );
  }
}
