"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { STUFEN, formatPunkte, type Stufe } from "@/lib/ivr";

/** Fragt die Systemeinstellung ab, ohne Zustand in einem Effekt zu setzen. */
function useReduzierteBewegung(): boolean {
  return React.useSyncExternalStore(
    (melde) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", melde);
      return () => mq.removeEventListener("change", melde);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Zählt eine Zahl auf ihren neuen Wert, statt sie springen zu lassen. Startet
 * immer beim gerade sichtbaren Wert, damit eine Änderung mitten in der
 * Bewegung keinen Sprung erzeugt.
 */
function useZaehler(ziel: number, dauer = 420): number {
  const reduziert = useReduzierteBewegung();
  const [wert, setWert] = React.useState(ziel);
  const sichtbar = React.useRef(ziel);

  React.useEffect(() => {
    // Bei reduzierter Bewegung wird nicht gezählt, der Zielwert geht direkt
    // hinaus. Der Merker wandert trotzdem mit, damit ein späteres Umschalten
    // der Systemeinstellung nicht von einem alten Stand aus loslegt.
    if (reduziert) {
      sichtbar.current = ziel;
      return;
    }
    if (sichtbar.current === ziel) return;

    const start = sichtbar.current;
    const t0 = performance.now();
    let raf = 0;

    const schritt = (t: number) => {
      const p = Math.min(1, (t - t0) / dauer);
      const eased = 1 - Math.pow(1 - p, 3);
      const aktuell = start + (ziel - start) * eased;
      sichtbar.current = aktuell;
      setWert(aktuell);
      if (p < 1) raf = requestAnimationFrame(schritt);
      else sichtbar.current = ziel;
    };

    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer, reduziert]);

  return reduziert ? ziel : wert;
}

export function Stufenleiter({
  stufe,
  punkte,
  aktiv,
}: {
  stufe: Stufe;
  punkte: number;
  /** Erst wenn Platzangebot und erwartete Besucherzahl stehen, gilt das Ergebnis. */
  aktiv: boolean;
}) {
  const gezaehlt = useZaehler(aktiv ? punkte : 0);
  const angezeigt = STUFEN[stufe];

  return (
    <div>
      {/* Auf kleinen Schirmen klebt nur die Leiter selbst oben, damit sie beim
          Ausfüllen sichtbar bleibt. Ab lg klebt die ganze Spalte. */}
      <div className="sticky top-0 z-20 -mx-4 space-y-3 border-b border-border bg-background px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:space-y-4 lg:border-b-0 lg:p-0">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-foreground">Ausbaustufe</h2>
        <p className="text-sm text-muted-foreground">
          {aktiv ? (
            <>
              <span data-zahl className="text-foreground">
                {formatPunkte(gezaehlt)}
              </span>{" "}
              Risikopunkte
            </>
          ) : (
            "Noch keine Angaben"
          )}
        </p>
      </div>

      <div
        className="relative flex h-16 overflow-hidden rounded-lg border border-border bg-card lg:h-[22rem] lg:flex-col-reverse"
        style={
          {
            "--stufe-x": stufe,
            "--stufe-y": 3 - stufe,
          } as React.CSSProperties
        }
      >
        {/* Der Marker liegt hinter den Bändern und ist die einzige gestaltete
            Bewegung der Seite. */}
        <div
          aria-hidden
          className={cn(
            "stufen-marker absolute inset-y-0 left-0 w-1/4 lg:inset-x-0 lg:h-1/4 lg:w-auto",
            aktiv ? "bg-brand-solid" : "bg-muted",
          )}
        />

        {STUFEN.map((s) => {
          const erreicht = aktiv && s.stufe === stufe;
          return (
            <div
              key={s.stufe}
              aria-hidden
              className={cn(
                "relative flex flex-1 flex-col justify-center gap-0.5 border-l border-border px-2 py-2 text-center first:border-l-0 lg:items-start lg:border-l-0 lg:border-t lg:px-4 lg:text-left lg:last:border-t-0",
                erreicht
                  ? "text-brand-solid-foreground"
                  : "text-muted-foreground",
              )}
            >
              <span
                data-zahl
                className="text-lg font-light leading-none lg:text-3xl"
              >
                {s.stufe}
              </span>
              <span className="text-[11px] leading-tight lg:hidden">
                {s.mobil}
              </span>
              <span className="hidden text-sm font-medium leading-tight lg:block">
                {s.titel}
              </span>
              <span className="hidden text-xs leading-tight lg:block">
                {s.bereich}
              </span>
            </div>
          );
        })}
      </div>
      </div>

      {/* Die Leiter ist eine Zeichnung. Für Vorlesesoftware steht der Befund
          hier im Klartext. */}
      <div aria-live="polite" className="mt-4 space-y-2">
        <p className="sr-only">
          {aktiv
            ? `Empfohlene Ausbaustufe ${stufe}, ${angezeigt.titel}, bei ${formatPunkte(punkte)} Risikopunkten nach Maurer.`
            : "Noch keine Ausbaustufe. Bitte Platzangebot und erwartete Besucherzahl angeben."}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Die Ausbaustufe sagt, wie stark der Sanitätsdienst besetzt sein muss.
        </p>
        {aktiv ? (
          <>
            <p className="text-base font-medium text-foreground">
              Stufe {stufe}: {angezeigt.titel}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {angezeigt.beschreibung}
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sobald Platzangebot und erwartete Besucherzahl stehen, wandert der
            Marker von Stufe 0 auf die Stufe, die sich aus Ihren Angaben ergibt.
          </p>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          Risikopunkte sind der Rechenwert aus Ihren Angaben nach der Formel von
          Maurer. Je mehr Punkte, desto höher die Stufe.
        </p>
      </div>
    </div>
  );
}
