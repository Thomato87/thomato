import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/lib/motion";
import { rechner } from "@/data/rechner";

/**
 * Verweis auf den Sanitätsdienst-Rechner, zwischen Leistungen und Prozess.
 *
 * Steht hier, weil er zur zweiten Säule gehört und weil ein Verweis von der
 * Startseite der Suchmaschine sagt, dass die Seite wichtig ist. Für Besucher
 * ist es der Weg, den sie ohne Klicken finden.
 */
export function RechnerHinweis() {
  return (
    <FadeIn>
      <section
        aria-labelledby="rechner-hinweis-titel"
        className="border-t border-border"
      >
        <div className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-24">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h3
                id="rechner-hinweis-titel"
                className="max-w-[18ch] text-2xl font-light tracking-tight sm:text-3xl md:text-4xl"
              >
                {rechner.startseite.titel}
              </h3>
            </div>

            <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8">
              <p className="max-w-[60ch] text-base leading-relaxed text-muted-foreground">
                {rechner.startseite.text}
              </p>
              <Link
                href={rechner.pfad}
                className="inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {rechner.startseite.cta}
                <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
