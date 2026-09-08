"use client";

import * as React from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import {
  LEERE_EINGABEN,
  SSB_GEFRAGT,
  VERANSTALTUNGSARTEN,
  werteAus,
  type Eingaben,
  type Ortstyp,
  type Quelle,
} from "@/lib/ivr";
import {
  AuswahlFeld,
  JaNeinFeld,
  OptionFeld,
  SchalterFeld,
  ZahlFeld,
} from "@/components/ui/felder";
import { Stufenleiter } from "@/components/rechner/stufenleiter";
import { Rechenweg } from "@/components/rechner/rechenweg";
import { PdfVersand } from "@/components/rechner/pdf-versand";
import {
  Bedarf,
  Befund,
  Gegenprobe,
  StufeNull,
  Vorbehalt,
} from "@/components/rechner/ergebnis";

function Gruppe({
  titel,
  beschreibung,
  children,
}: {
  titel: string;
  beschreibung?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-5 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <legend className="sr-only">{titel}</legend>
      <div className="space-y-1.5">
        <h2 className="display-md text-foreground">{titel}</h2>
        {beschreibung ? (
          <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
            {beschreibung}
          </p>
        ) : null}
      </div>
      <div className="space-y-5">{children}</div>
    </fieldset>
  );
}

const SSB_BLOECKE = [
  "Aktiv Beteiligte",
  "Zuschauer und Besucher",
  "Umfeld",
] as const;

export function Rechner({ kopf }: { kopf?: React.ReactNode }) {
  const [eingaben, setEingaben] = React.useState<Eingaben>(LEERE_EINGABEN);

  const setzen = React.useCallback(
    <K extends keyof Eingaben>(schluessel: K, wert: Eingaben[K]) => {
      setEingaben((vorher) => ({ ...vorher, [schluessel]: wert }));
    },
    [],
  );

  const auswertung = React.useMemo(() => werteAus(eingaben), [eingaben]);
  const gerechnet = auswertung.maurer.vollstaendig;
  const flaecheNoetig =
    eingaben.maxQuelle === "flaeche" || eingaben.erwartetQuelle === "flaeche";

  return (
    /* Die Reihenfolge im Dokument ist Titel, Leiter, Formular. Das stimmt auf
       kleinen Schirmen genau so, ab lg setzt die feste Rasterzuweisung Titel
       und Formular untereinander in die linke Spalte und stellt die Leiter
       daneben. */
    <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-16">
      {kopf ? (
        <div className="min-w-0 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          {kopf}
        </div>
      ) : null}

      {/* ─── Leiter ─────────────────────────────────────────────────────── */}
      <aside className="min-w-0 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
        <div className="lg:sticky lg:top-10">
          <Stufenleiter
            stufe={auswertung.stufe}
            punkte={auswertung.maurer.gesamt}
            aktiv={gerechnet}
          />
        </div>
      </aside>

      {/* ─── Eingaben und Ergebnis ──────────────────────────────────────── */}
      <div className="min-w-0 space-y-12 lg:col-span-8 lg:col-start-1 lg:row-start-2">
        <div className="space-y-10">
          <Gruppe
            titel="Ihre Veranstaltung"
            beschreibung="Zwei Angaben, die die Richtlinie unterschiedlich gewichtet: was gefeiert wird und ob es drinnen oder draussen stattfindet."
          >
            <AuswahlFeld
              id="art"
              label="Um was für eine Veranstaltung geht es?"
              hinweis="Wählen Sie, was am ehesten passt. Die Richtlinie rechnet jede Art unterschiedlich stark an: ein Reitturnier zählt am wenigsten, ein Rockkonzert am meisten. Wenn nichts passt, nehmen Sie die allgemeine Veranstaltung."
              wert={eingaben.art}
              onWert={(v) => setzen("art", v)}
              optionen={VERANSTALTUNGSARTEN}
            />

            <OptionFeld<Ortstyp>
              name="ort"
              label="Wo findet sie statt?"
              hinweis="In geschlossenen Gebäuden ist das Risiko höher. Die Richtlinie zählt das Platzangebot dort ein zweites Mal."
              wert={eingaben.ort}
              onWert={(v) => setzen("ort", v)}
              optionen={[
                {
                  id: "freigelaende",
                  label: "Im Freien",
                  detail: "Platz, Wiese, Strasse, Zelt ohne feste Bauhülle",
                },
                {
                  id: "gebaeude",
                  label: "In einem Gebäude",
                  detail: "Halle, Saal, Stadion, geschlossene bauliche Anlage",
                },
              ]}
            />
          </Gruppe>

          <Gruppe
            titel="Wie viele Menschen"
            beschreibung="Die Richtlinie fragt zweimal nach Zahlen: einmal, wie viele Personen überhaupt Platz hätten, und einmal, wie viele Sie tatsächlich erwarten. Beides zählt getrennt."
          >
            <OptionFeld<Quelle>
              name="maxQuelle"
              label="Wie viele Personen haben höchstens Platz?"
              hinweis="Aus Auflagen, Bestuhlung oder zugelassenen Sitz- und Stehplätzen. Wenn Sie das nicht wissen, rechnen Sie über die Fläche."
              wert={eingaben.maxQuelle}
              onWert={(v) => setzen("maxQuelle", v)}
              optionen={[
                { id: "zahl", label: "Ich kenne die Zahl" },
                { id: "flaeche", label: "Über die Fläche rechnen" },
              ]}
            />

            {eingaben.maxQuelle === "zahl" ? (
              <ZahlFeld
                id="maxZahl"
                label="Zulässige Personenzahl"
                einheit="Personen"
                placeholder="zum Beispiel 1200"
                wert={eingaben.maxZahl}
                onWert={(v) => setzen("maxZahl", v)}
              />
            ) : null}

            {flaecheNoetig ? (
              <ZahlFeld
                id="flaeche"
                label="Nutzbare Fläche"
                einheit="m²"
                placeholder="zum Beispiel 3000"
                hinweis="Die Richtlinie rechnet für das Platzangebot mit 4 Personen je Quadratmeter und für die erwartete Besucherzahl aus Sicherheitsgründen mit nur 2."
                wert={eingaben.flaeche}
                onWert={(v) => setzen("flaeche", v)}
              />
            ) : null}

            <OptionFeld<Quelle>
              name="erwartetQuelle"
              label="Wie viele Besucher erwarten Sie tatsächlich?"
              hinweis="Aus dem Vorverkauf oder aus Erfahrungswerten vergleichbarer Anlässe."
              wert={eingaben.erwartetQuelle}
              onWert={(v) => setzen("erwartetQuelle", v)}
              optionen={[
                { id: "zahl", label: "Ich schätze die Zahl" },
                { id: "flaeche", label: "Über die Fläche rechnen" },
              ]}
            />

            {eingaben.erwartetQuelle === "zahl" ? (
              <ZahlFeld
                id="erwartetZahl"
                label="Erwartete Besucherzahl"
                einheit="Personen"
                placeholder="zum Beispiel 800"
                wert={eingaben.erwartetZahl}
                onWert={(v) => setzen("erwartetZahl", v)}
              />
            ) : null}
          </Gruppe>

          <Gruppe
            titel="Besondere Umstände"
            beschreibung="Zwei Zuschläge, die die Richtlinie kennt. Beide bleiben bei den allermeisten Anlässen auf null."
          >
            <ZahlFeld
              id="prominente"
              label="Wie viele prominente Persönlichkeiten nehmen teil?"
              einheit="Personen"
              placeholder="0"
              hinweis="Gemeint sind Personen, die wegen möglicher Demonstrationen oder Attentate ein erhöhtes Risiko bedeuten und mit Sicherheitsauflagen kommen. Je 5 Personen zählen 10 Punkte, höchstens 30."
              wert={eingaben.prominente === 0 ? null : eingaben.prominente}
              onWert={(v) => setzen("prominente", v ?? 0)}
              max={999}
            />

            <SchalterFeld
              id="gewaltbereitschaft"
              label="Die Polizei rechnet mit Gewaltbereitschaft"
              hinweis="Ergibt sich aus Abstimmungsgesprächen mit der Polizei zur erwarteten Besuchergruppe. Zählt 10 Punkte."
              wert={eingaben.gewaltbereitschaft}
              onWert={(v) => setzen("gewaltbereitschaft", v)}
            />
          </Gruppe>
        </div>

        {/* ─── Gegenprobe, freiwillig ───────────────────────────────────── */}
        <details className="group rounded-lg border border-border bg-card">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
            <span className="space-y-1">
              <span className="block text-base font-medium text-foreground">
                Gegenprobe und Prüfung auf Stufe 0
              </span>
              <span className="block max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                Siebzehn kurze Fragen. Sie führen den zweiten Weg aus, den die
                Richtlinie empfiehlt, und prüfen, ob Ihr Anlass ganz ohne
                Sanitätsdienst auskommt. Das Ergebnis oben steht auch ohne sie.
              </span>
            </span>
            <ChevronRight
              aria-hidden
              className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
              strokeWidth={1.75}
            />
          </summary>

          <div className="max-w-[46rem] space-y-8 border-t border-border px-4 py-6 sm:px-5">
            <div className="space-y-4">
              <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                Mitwirkende sind alle, die aktiv beteiligt sind, also Sportler,
                Musikerinnen oder Umzugsteilnehmer. Die Dauer auf volle Stunden
                aufrunden. Die Fahrzeit meint den Weg bis zur nächsten
                notärztlichen Versorgung.
              </p>
              <div className="grid gap-5 sm:grid-cols-3">
                <ZahlFeld
                  id="mitwirkende"
                  label="Aktiv Mitwirkende"
                  einheit="Pers."
                  placeholder="0"
                  wert={eingaben.mitwirkende}
                  onWert={(v) => setzen("mitwirkende", v)}
                />
                <ZahlFeld
                  id="dauer"
                  label="Dauer"
                  einheit="Std."
                  placeholder="0"
                  wert={eingaben.dauerStunden}
                  onWert={(v) => setzen("dauerStunden", v)}
                />
                <ZahlFeld
                  id="fahrzeit"
                  label="Fahrzeit zum Notarzt"
                  einheit="Min."
                  placeholder="0"
                  wert={eingaben.fahrzeitMinuten}
                  onWert={(v) => setzen("fahrzeitMinuten", v)}
                />
              </div>
            </div>

            {SSB_BLOECKE.map((block) => {
              const fragen = SSB_GEFRAGT.filter((f) => f.block === block);
              if (fragen.length === 0) return null;
              return (
                <fieldset key={block} className="space-y-1">
                  <legend className="mb-2 text-sm font-medium text-foreground">
                    {block}
                  </legend>
                  <div className="border-t border-border">
                    {fragen.map((f) => (
                      <JaNeinFeld
                        key={f.id}
                        name={f.id}
                        frage={f.frage}
                        wert={eingaben.ssb[f.id]}
                        onWert={(v) =>
                          setzen("ssb", { ...eingaben.ssb, [f.id]: v })
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              );
            })}

            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
              Die Fragen nach der Zahl der Mitwirkenden und der Zuschauer
              beantwortet der Rechner selbst aus Ihren Angaben oben. Sie
              erscheinen deshalb hier nicht noch einmal.
            </p>
          </div>
        </details>

        {/* ─── Ergebnis ─────────────────────────────────────────────────── */}
        {gerechnet ? (
          <div className="space-y-10">
            <Befund auswertung={auswertung} />
            <Bedarf auswertung={auswertung} />
            {/* Der Vorbehalt steht unmittelbar hinter den Zahlen. Wer nur den
                Bedarf liest und aufhört, muss ihn trotzdem gesehen haben. */}
            <Vorbehalt />
            <PdfVersand eingaben={eingaben} />
            {auswertung.stufe <= 1 ? <StufeNull auswertung={auswertung} /> : null}
            <Gegenprobe auswertung={auswertung} />
            <Rechenweg auswertung={auswertung} />
            <div>
              <button
                type="button"
                onClick={() => setEingaben(LEERE_EINGABEN)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <RotateCcw aria-hidden className="size-3.5" strokeWidth={1.75} />
                Angaben zurücksetzen
              </button>
            </div>
          </div>
        ) : (
          <div className="border-y border-border py-8">
            <p className="max-w-[60ch] text-base leading-relaxed text-muted-foreground">
              Sobald das Platzangebot und die erwartete Besucherzahl stehen,
              erscheint hier die empfohlene Ausbaustufe mit dem Bedarf an
              Personal und Mitteln, dem vollständigen Rechenweg und dem, was Sie
              damit noch tun müssen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
