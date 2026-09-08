"use client";

import * as React from "react";
import { Check, Minus, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EINSATZLEITUNG_TEXT,
  STUFEN,
  formatPunkte,
  type Auswertung,
} from "@/lib/ivr";

/* ─── Bedarf an Personal und Mitteln ────────────────────────────────────── */

function Zeile({
  begriff,
  wert,
  detail,
}: {
  begriff: string;
  wert: React.ReactNode;
  detail?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-border py-3 first:border-t-0">
      <dt className="text-sm font-medium text-foreground">{begriff}</dt>
      <dd
        data-zahl
        className="text-right text-lg font-light text-foreground tabular-nums"
      >
        {wert}
      </dd>
      {detail ? (
        <p className="col-span-2 -mt-0.5 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

export function Bedarf({ auswertung }: { auswertung: Auswertung }) {
  const { mittel, maurer } = auswertung;

  const samariter =
    mittel.samariterMin === 0
      ? "keine"
      : mittel.samariterMin === mittel.samariterMax
        ? String(mittel.samariterMin)
        : `${mittel.samariterMin} bis ${mittel.samariterMax}`;

  return (
    <section aria-labelledby="bedarf-titel" className="space-y-4">
      <h2 id="bedarf-titel" className="display-md text-foreground">
        Was Ihre Veranstaltung nach dieser Rechnung braucht
      </h2>

      <dl className="border-y border-border">
        <Zeile
          begriff="Samariter"
          wert={samariter}
          detail="Instruierte Samariter und vergleichbar ausgebildete medizinische Hilfskräfte. Die Zahl versteht sich ohne Personal der Rettungsdienste, ohne Einsatzleitung und ohne Sanitätshilfsstelle, also ohne einen eingerichteten Behandlungsplatz auf dem Gelände."
        />
        <Zeile
          begriff="Rettungswagen"
          wert={mittel.rettungswagen === 0 ? "keiner" : mittel.rettungswagen}
          detail="Einsatzbereite Rettungswagen vor Ort, zusätzlich zur ordentlichen Versorgung in der Region."
        />
        <Zeile
          begriff="Notärzte"
          wert={mittel.notaerzte === 0 ? "keiner" : mittel.notaerzte}
          detail="Notärzte oder Notarzteinsatzfahrzeuge, also Fahrzeuge, die den Notarzt an den Einsatzort bringen. Je nach Art der Veranstaltung können auch Ärzte mit notfallmedizinischen Kompetenzen vollwertige Dienste leisten."
        />
        <Zeile
          begriff="Einsatzleitung"
          wert={
            <span className="text-base font-normal">
              {mittel.einsatzleitung === "keine"
                ? "keine"
                : mittel.einsatzleitung === "reduziert"
                  ? "reduziert"
                  : "voll"}
            </span>
          }
          detail={EINSATZLEITUNG_TEXT[mittel.einsatzleitung]}
        />
      </dl>

      {mittel.rettungswagen >= 1 ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-foreground">
          Ab einem Rettungswagen gehören die Sanitätstrupps mit Fachpersonal
          verstärkt. Die Zahl der Samariter oben deckt das nicht ab, sie zählt
          ausdrücklich ohne Personal der Rettungsdienste. Rettungssanitäter und,
          je nach Lage, Ärzte kommen zusätzlich dazu. Genau das meint die
          Ausbaustufe 2 der Richtlinie: Sanitätsposten, verstärkt durch
          Fachpersonal, das die Verantwortung und die Triage übernimmt.
        </p>
      ) : null}

      {mittel.ueberTabelle ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Ihre Veranstaltung liegt mit {formatPunkte(maurer.gesamt)} Punkten über
          dem Bereich, den die Tabelle der Richtlinie abdeckt. Sie endet bei 140
          Punkten. Die ausgewiesenen Zahlen sind deshalb Untergrenzen.
        </p>
      ) : null}

      <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
        Der Krankentransportwagen KTW, den die deutsche Vorlage an dieser Stelle
        ausweist, fehlt bewusst. Er ist im schweizerischen Rettungswesen keine
        eigene Kategorie. Die Richtlinie verlangt in Ziff. 4.3 ausdrücklich, die
        Bemessung an die schweizerischen Strukturen anzupassen.
      </p>
    </section>
  );
}

/* ─── Ziff. 4.1: ganz ohne Sanitätsdienst ───────────────────────────────── */

export function StufeNull({ auswertung }: { auswertung: Auswertung }) {
  const { stufeNull } = auswertung;

  return (
    <section aria-labelledby="stufe-null-titel" className="space-y-3">
      <h3 id="stufe-null-titel" className="text-base font-medium text-foreground">
        Ginge es ganz ohne Sanitätsdienst?
      </h3>
      <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
        Die Richtlinie nennt in Ziff. 4.1 fünf Bedingungen. Nur wenn alle fünf
        gleichzeitig zutreffen, ist in der Regel kein Sanitätsdienst nötig.
      </p>
      <ul className="space-y-0">
        {stufeNull.kriterien.map((k) => (
          <li
            key={k.label}
            className="flex items-start gap-3 border-t border-border py-2.5 first:border-t-0"
          >
            <span
              aria-hidden
              className={cn(
                "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                k.erfuellt === true && "border-brand-solid bg-brand-solid text-brand-solid-foreground",
                k.erfuellt === false && "border-muted-foreground/50",
                k.erfuellt === null && "border-dashed border-muted-foreground/50",
              )}
            >
              {k.erfuellt === true ? (
                <Check className="size-2.5" strokeWidth={3} />
              ) : k.erfuellt === false ? (
                <Minus className="size-2.5 text-muted-foreground" strokeWidth={3} />
              ) : null}
            </span>
            <span className="text-sm leading-relaxed">
              <span
                className={cn(
                  k.erfuellt === true ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {k.label}
              </span>
              <span className="sr-only">
                {k.erfuellt === true
                  ? " ist erfüllt."
                  : k.erfuellt === false
                    ? " ist nicht erfüllt."
                    : " ist noch offen."}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="max-w-[65ch] text-sm leading-relaxed text-foreground">
        {stufeNull.erfuellt
          ? "Alle fünf Bedingungen sind erfüllt. In der Regel ist kein Sanitätsdienst vor Ort erforderlich. Das entbindet nicht von der Abstimmung mit der Gemeinde."
          : stufeNull.unvollstaendig
            ? "Noch nicht alle Angaben liegen vor. Ergänzen Sie die offenen Punkte in der Gegenprobe."
            : "Mindestens eine Bedingung ist nicht erfüllt. Ein Sanitätsdienst ist vorzusehen."}
      </p>
    </section>
  );
}

/* ─── Gegenprobe nach Samariterbund ─────────────────────────────────────── */

export function Gegenprobe({ auswertung }: { auswertung: Auswertung }) {
  const { ssb, maurer, widerspruch } = auswertung;
  const beantwortet = ssb.offen === 0;

  return (
    <section aria-labelledby="gegenprobe-titel" className="space-y-3">
      <h3 id="gegenprobe-titel" className="text-base font-medium text-foreground">
        Gegenprobe nach dem Samariterbund
      </h3>
      <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
        Die Richtlinie empfiehlt für kleinere Veranstaltungen ein zweites
        Verfahren, den Fragebogen aus dem Postendienstreglement des
        Schweizerischen Samariterbundes. Er zählt schlicht die Ja-Antworten.
      </p>

      <dl className="border-y border-border">
        <div className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-t border-border py-3 first:border-t-0">
          <dt className="text-sm font-medium">Ja-Antworten von 22</dt>
          <dd data-zahl className="text-lg font-light tabular-nums">
            {ssb.ja}
          </dd>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-t border-border py-3">
          <dt className="text-sm font-medium">Ausbaustufe nach diesem Weg</dt>
          <dd data-zahl className="text-lg font-light tabular-nums">
            {beantwortet ? ssb.stufe : "–"}
          </dd>
        </div>
      </dl>

      {!beantwortet ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Noch {ssb.offen} von {ssb.offen === 1 ? "einer Frage" : "den Fragen"}{" "}
          offen. Die Richtlinie verlangt, dass jede Zeile beantwortet wird, sonst
          hat die Gegenprobe keine Aussagekraft.
        </p>
      ) : widerspruch ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-foreground">
          Die beiden Verfahren kommen zu unterschiedlichen Ergebnissen: Maurer
          auf Stufe {maurer.stufe}, der Samariterbund-Fragebogen auf Stufe{" "}
          {ssb.stufe}. Das ist kein Fehler. Die Richtlinie hält fest, dass die
          Risikobeurteilung nicht nach einem festen Schema erfolgen kann und
          einzelne Aspekte wie Unfallrisiko, gefährdete Gruppen, Gelände und
          Wetter stärker zu gewichten sein können. Nehmen Sie im Zweifel die
          höhere Stufe als Ausgangspunkt für das Gespräch.
        </p>
      ) : (
        <p className="max-w-[65ch] text-sm leading-relaxed text-foreground">
          Beide Verfahren kommen auf Stufe {ssb.stufe}. Das stützt das Ergebnis.
        </p>
      )}
    </section>
  );
}

/* ─── Vorbehalt ─────────────────────────────────────────────────────────── */

export function Vorbehalt() {
  return (
    <section
      aria-labelledby="vorbehalt-titel"
      className="rounded-lg border border-border bg-brand-muted p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <TriangleAlert
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-brand"
          strokeWidth={1.75}
        />
        <div className="space-y-3">
          <h2 id="vorbehalt-titel" className="text-base font-medium text-foreground">
            Was dieses Ergebnis ist und was nicht
          </h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/90">
            <li>
              Es ist eine <strong className="font-medium">Empfehlung</strong>{" "}
              anhand der aktuellen Richtlinien des Interverbands für Rettungswesen
              IVR. Es ist keine verbindliche Vorgabe und keine behördliche
              Auflage. Die Richtlinien haben ausdrücklich Empfehlungscharakter.
            </li>
            <li>
              Die Berechnung orientiert sich an der{" "}
              <strong className="font-medium">Formel von Maurer</strong>. Deren
              Ergebnisse müssen laut Richtlinie anhand der individuellen
              Gegebenheiten überprüft und wo nötig angepasst werden.
            </li>
            <li>
              Das Ergebnis muss{" "}
              <strong className="font-medium">
                zwingend mit dem regionalen Rettungsdienst und den Bestimmungen
                Ihrer Gemeinde abgestimmt
              </strong>{" "}
              werden. Die Bewilligungsbehörde kann eigene Auflagen festlegen, und
              diese gehen vor. Nehmen Sie früh Kontakt auf, in der Regel
              mindestens drei Monate vorher, bei Grossanlässen sechs.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─── Kurzfassung über dem Ergebnis ─────────────────────────────────────── */

export function Befund({ auswertung }: { auswertung: Auswertung }) {
  const { stufe, maurer } = auswertung;
  const s = STUFEN[stufe];

  return (
    <div className="space-y-4 border-b border-border pb-6">
      <h2 className="display-lg text-foreground">
        Stufe {stufe}
        <span className="block text-muted-foreground">{s.titel}</span>
      </h2>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border pt-3">
        <p className="text-sm text-muted-foreground">Gesamtrisiko nach Maurer</p>
        <p data-zahl className="text-sm text-foreground">
          {formatPunkte(maurer.gesamt)} Punkte
        </p>
      </div>
      <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
        Was dieses Ergebnis ist und was nicht, steht unter der Aufstellung.
      </p>
    </div>
  );
}
