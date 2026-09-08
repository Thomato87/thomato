"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Loader2, Mail, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Eingaben } from "@/lib/ivr";
import { SchalterFeld, TextFeld } from "@/components/ui/felder";

type Zustand = "ruhend" | "sendet" | "gesendet" | "fehler";

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Versand des Ergebnisses als PDF.
 *
 * Die Adresse wird gebraucht, um das Dokument zuzustellen. Thomato sieht sie
 * dabei, und das steht auch so da. Ob die Adresse darüber hinaus für eine
 * Kontaktaufnahme genutzt werden darf, ist eine eigene, freiwillige Frage:
 * das Dokument gibt es in jedem Fall.
 */
export function PdfVersand({ eingaben }: { eingaben: Eingaben }) {
  const [email, setEmail] = React.useState("");
  const [bezeichnung, setBezeichnung] = React.useState("");
  const [einwilligung, setEinwilligung] = React.useState(false);
  const [falle, setFalle] = React.useState("");
  const [zustand, setZustand] = React.useState<Zustand>("ruhend");
  const [fehler, setFehler] = React.useState<string | null>(null);

  const adresseTaugt = EMAIL_MUSTER.test(email.trim());

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    if (!adresseTaugt) {
      setFehler("Bitte eine vollständige E-Mail-Adresse eintragen.");
      return;
    }
    setFehler(null);
    setZustand("sendet");

    try {
      const antwort = await fetch("/api/rechner-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          bezeichnung: bezeichnung.trim() || undefined,
          einwilligung,
          falle,
          eingaben,
        }),
      });

      if (!antwort.ok) {
        const inhalt = await antwort.json().catch(() => null);
        throw new Error(inhalt?.error ?? "Unbekannter Fehler");
      }
      setZustand("gesendet");
    } catch {
      setZustand("fehler");
      setFehler(
        "Der Versand hat nicht geklappt. Versuchen Sie es später noch einmal, oder schreiben Sie an info@thomato.ch.",
      );
    }
  }

  if (zustand === "gesendet") {
    return (
      <section
        aria-labelledby="pdf-titel"
        className="rounded-lg border border-border bg-card p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-solid text-brand-solid-foreground"
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
          <div className="space-y-2">
            <h2 id="pdf-titel" className="text-base font-medium text-foreground">
              Unterwegs an {email.trim()}
            </h2>
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              Das PDF enthält die Ausbaustufe, den Bedarf an Personal und
              Mitteln, den vollständigen Rechenweg und die Hinweise zur
              Abstimmung mit Rettungsdienst und Gemeinde. Kommt nichts an, sehen
              Sie im Spam-Ordner nach.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="pdf-titel"
      className="rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <Mail
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-brand"
            strokeWidth={1.75}
          />
          <div className="space-y-2">
            <h2 id="pdf-titel" className="text-base font-medium text-foreground">
              Ergebnis als PDF erhalten
            </h2>
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              Ein Dokument zum Ausdrucken und Weitergeben, mit Ausbaustufe,
              Personalbedarf, vollständigem Rechenweg und den Hinweisen zur
              Abstimmung. Geeignet als Beilage zum Bewilligungsgesuch.
            </p>
          </div>
        </div>

        <form onSubmit={absenden} className="space-y-5" noValidate>
          <TextFeld
            id="pdf-email"
            typ="email"
            label="Ihre E-Mail-Adresse"
            placeholder="name@beispiel.ch"
            autoComplete="email"
            required
            wert={email}
            onWert={(v) => {
              setEmail(v);
              if (fehler) setFehler(null);
            }}
            fehler={fehler ?? undefined}
          />

          <TextFeld
            id="pdf-bezeichnung"
            label="Name der Veranstaltung"
            hinweis="Freiwillig. Steht dann im Kopf des Dokuments, was hilft, wenn Sie mehrere Varianten rechnen."
            placeholder="zum Beispiel Dorffest Luterbach 2027"
            autoComplete="off"
            wert={bezeichnung}
            onWert={setBezeichnung}
          />

          <SchalterFeld
            id="pdf-einwilligung"
            label="Thomato darf mich zu diesem Anlass kontaktieren"
            hinweis="Freiwillig. Ohne Häkchen bekommen Sie nur das PDF und sonst nichts."
            wert={einwilligung}
            onWert={setEinwilligung}
          />

          {/* Unsichtbar für Menschen, sichtbar für einfache Bots. */}
          <div aria-hidden className="hidden">
            <label htmlFor="pdf-falle">Dieses Feld bitte leer lassen</label>
            <input
              id="pdf-falle"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={falle}
              onChange={(e) => setFalle(e.target.value)}
            />
          </div>

          <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            Die Adresse wird gebraucht, um Ihnen das Dokument zuzustellen.
            Thomato erfährt sie dabei, zusammen mit dem Ergebnis dieser
            Berechnung. Näheres in der{" "}
            <Link
              href="/datenschutz"
              className="text-foreground underline decoration-border hover:decoration-brand"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>

          {zustand === "fehler" && fehler ? (
            <p
              role="alert"
              className="flex items-start gap-2 text-sm leading-relaxed text-destructive"
            >
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              {fehler}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={zustand === "sendet"} className="gap-2">
            {zustand === "sendet" ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" strokeWidth={2} />
                Wird gesendet
              </>
            ) : (
              "PDF zusenden"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
