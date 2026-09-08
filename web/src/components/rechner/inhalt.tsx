import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { rechner } from "@/data/rechner";

/**
 * Der Teil unter dem Rechner. Er trägt die Seite in der Suche: ein Werkzeug
 * allein ist dafür zu wenig Inhalt. Alle Texte stehen in data/rechner.ts.
 *
 * Bewusst ohne Client-Code. Die Fragen klappen über natives details auf.
 */

export function Erklaerung() {
  return (
    <section
      aria-labelledby="erklaerung-titel"
      className="border-t border-border pt-12 sm:pt-16"
    >
      <h2 id="erklaerung-titel" className="display-lg max-w-[20ch] text-foreground">
        Was das Ergebnis für Sie bedeutet
      </h2>

      <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-16">
        {rechner.erklaerung.map((teil) => (
          <article
            key={teil.titel}
            className="grid gap-x-12 gap-y-4 lg:grid-cols-12"
          >
            <h3 className="display-md text-foreground lg:col-span-4 lg:col-start-1">
              {teil.titel}
            </h3>
            <div className="space-y-4 lg:col-span-7 lg:col-start-6">
              {teil.absaetze.map((absatz, i) => (
                <p
                  key={i}
                  className="max-w-[60ch] text-base leading-relaxed text-muted-foreground"
                >
                  {absatz}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HaeufigeFragen() {
  return (
    <section
      aria-labelledby="faq-titel"
      className="border-t border-border pt-12 sm:pt-16"
    >
      <h2 id="faq-titel" className="display-lg text-foreground">
        Häufige Fragen
      </h2>

      <div className="mt-8 border-t border-border">
        {rechner.faq.map((f) => (
          <details key={f.frage} className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base font-medium text-foreground transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
              <span className="max-w-[52ch]">{f.frage}</span>
              <ChevronRight
                aria-hidden
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
                strokeWidth={1.75}
              />
            </summary>
            <p className="max-w-[60ch] pb-6 text-base leading-relaxed text-muted-foreground">
              {f.antwort}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Abschluss() {
  return (
    <section
      aria-labelledby="abschluss-titel"
      className="border-t border-border pt-12 sm:pt-16"
    >
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <h2
          id="abschluss-titel"
          className="display-lg max-w-[16ch] text-foreground lg:col-span-5"
        >
          {rechner.abschluss.titel}
        </h2>

        <div className="space-y-5 lg:col-span-6 lg:col-start-7">
          {rechner.abschluss.absaetze.map((absatz, i) => (
            <p
              key={i}
              className="max-w-[60ch] text-base leading-relaxed text-muted-foreground"
            >
              {absatz}
            </p>
          ))}

          <p className="border-t border-border pt-5 text-base text-foreground">
            {rechner.abschluss.hinweis}
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-1">
            <Link
              href={rechner.abschluss.cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-medium text-brand-solid-foreground transition-colors hover:bg-brand-solid/90"
            >
              {rechner.abschluss.cta.label}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
            <Link
              href={rechner.abschluss.zweit.href}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground underline decoration-border transition-colors hover:text-foreground hover:decoration-brand"
            >
              {rechner.abschluss.zweit.label}
              <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
