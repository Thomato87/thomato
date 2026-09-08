import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/lib/motion";
import { brand } from "@/data/brand";

/**
 * Häufige Fragen als native `details`. Die Antworten stehen damit im HTML,
 * für Suchmaschinen wie für Vorlesesoftware; das Radix-Akkordeon hat sie erst
 * beim Klick gerendert. `name` lässt den Browser jeweils nur eine Frage offen
 * halten, wie vorher das Akkordeon.
 */
export function FAQ() {
  return (
    <section id="faq" className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-28 md:px-12 lg:px-24">
        <FadeIn className="mb-10 grid grid-cols-1 gap-4 sm:mb-16 sm:gap-8 md:grid-cols-2 md:items-end">
          <h2 className="display-lg">Häufige Fragen.</h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Nicht dabei? Schreiben Sie mir, ich antworte persönlich, in der Regel am selben Werktag.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="max-w-3xl">
          <div className="w-full">
            {brand.faqs.map((faq, i) => (
              <details key={i} name="faq" className="group border-b border-border">
                <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-4 py-4 text-left text-sm font-medium [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-4">
                    {/* Die Nummer ist Schmuck; Vorlesesoftware las sie als Teil der Frage. */}
                    <span aria-hidden className="eyebrow mt-0.5 tabular-nums text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-[60ch] pb-4 pl-7 text-sm leading-relaxed text-muted-foreground sm:pl-10">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
