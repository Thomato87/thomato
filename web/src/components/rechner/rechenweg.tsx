"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { formatPunkte, formatZahl, type Auswertung } from "@/lib/ivr";

function Zeile({
  nr,
  was,
  grundlage,
  punkte,
}: {
  nr: string;
  was: string;
  grundlage: React.ReactNode;
  punkte: React.ReactNode;
}) {
  return (
    <tr className="border-t border-border align-top">
      <td className="py-2.5 pr-3 text-sm text-muted-foreground tabular-nums">
        {nr}
      </td>
      <td className="py-2.5 pr-4 text-sm text-foreground">{was}</td>
      <td className="py-2.5 pr-4 text-sm text-muted-foreground">{grundlage}</td>
      <td
        data-zahl
        className="py-2.5 text-right text-sm font-medium text-foreground tabular-nums"
      >
        {punkte}
      </td>
    </tr>
  );
}

export function Rechenweg({ auswertung }: { auswertung: Auswertung }) {
  const { maurer } = auswertung;

  return (
    <details className="group rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-foreground sm:px-5 [&::-webkit-details-marker]:hidden">
        <span>
          Rechenweg im Einzelnen, Anhang 3-3 der Richtlinie
        </span>
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
          strokeWidth={1.75}
        />
      </summary>

      <div className="space-y-4 border-t border-border px-4 py-5 sm:px-5">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[34rem] border-collapse">
            <caption className="sr-only">
              Ermittlung des Gesamtrisikos nach Anhang 3-3 der IVR-Richtlinie
            </caption>
            <thead>
              <tr className="text-left">
                <th scope="col" className="pb-2 pr-3 text-xs font-medium text-muted-foreground">
                  Zeile
                </th>
                <th scope="col" className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Parameter
                </th>
                <th scope="col" className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Grundlage
                </th>
                <th scope="col" className="pb-2 text-right text-xs font-medium text-muted-foreground">
                  Punkte
                </th>
              </tr>
            </thead>
            <tbody>
              <Zeile
                nr="1"
                was="Maximal zulässige Besucherzahl"
                grundlage={
                  maurer.zeile1AusFlaeche
                    ? `${formatZahl(maurer.zeile1Basis)} Personen, aus der Fläche mit 4 Personen je m²`
                    : `${formatZahl(maurer.zeile1Basis)} Personen`
                }
                punkte={maurer.zeile1}
              />
              <Zeile
                nr="2"
                was="Verdoppelung in geschlossener baulicher Anlage"
                grundlage={
                  maurer.zeile2 > 0
                    ? "In einem Gebäude, Zeile 1 zählt ein zweites Mal"
                    : "Im Freien, keine Verdoppelung"
                }
                punkte={maurer.zeile2}
              />
              <Zeile
                nr="3"
                was="Tatsächlich erwartete Besucherzahl"
                grundlage={
                  maurer.zeile3AusFlaeche
                    ? `${formatZahl(maurer.zeile3Basis)} Personen, aus der Fläche mit 2 Personen je m², ein Punkt je volle 500`
                    : `${formatZahl(maurer.zeile3Basis)} Personen, ein Punkt je volle 500`
                }
                punkte={maurer.zeile3}
              />
              <Zeile
                nr="4"
                was="Bewertungsfaktor nach Art der Veranstaltung"
                grundlage={maurer.artLabel}
                punkte={`× ${formatPunkte(maurer.faktor)}`}
              />
              <Zeile
                nr="5"
                was="Gewichtetes Zwischenergebnis"
                grundlage={`(${maurer.zeile1} + ${maurer.zeile2} + ${maurer.zeile3}) × ${formatPunkte(maurer.faktor)}`}
                punkte={formatPunkte(maurer.zeile5)}
              />
              <Zeile
                nr="6"
                was="Beteiligung prominenter Persönlichkeiten"
                grundlage={
                  maurer.zeile6 > 0
                    ? "Je 5 Prominente 10 Punkte, höchstens 30"
                    : "Keine"
                }
                punkte={maurer.zeile6}
              />
              <Zeile
                nr="7"
                was="Polizeiliche Erkenntnisse"
                grundlage={
                  maurer.zeile7 > 0
                    ? "10 Punkte bei bekannter Gewaltbereitschaft"
                    : "Keine"
                }
                punkte={maurer.zeile7}
              />
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground/20">
                <td className="pt-3 pr-3 text-sm text-muted-foreground tabular-nums">
                  8
                </td>
                <td className="pt-3 pr-4 text-sm font-medium text-foreground" colSpan={2}>
                  Gesamtrisiko
                </td>
                <td
                  data-zahl
                  className="pt-3 text-right text-base font-medium text-foreground tabular-nums"
                >
                  {formatPunkte(maurer.gesamt)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">
            Vom Punktwert zur Ausbaustufe, Ziff. 4.3.4
          </p>
          <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            Bis 2 Punkte Stufe 0, bis 4 Punkte Stufe 1, ab 4 Punkten mindestens
            Stufe 2, mehr als 30 Punkte Stufe 3. Ihre{" "}
            {formatPunkte(maurer.gesamt)} Punkte ergeben Stufe {maurer.stufe}.
          </p>
          <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            Der Bedarf an Personal und Mitteln stammt aus Anhang 4, wo jedem
            Punktebereich eine Besetzung zugeordnet ist.
          </p>
        </div>
      </div>
    </details>
  );
}
