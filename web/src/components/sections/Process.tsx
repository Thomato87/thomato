import { Badge } from "@/components/ui/badge";
import { FadeIn, Stagger, StaggerItem } from "@/lib/motion";
import { brand } from "@/data/brand";

export function Process() {
  return (
    <section id="prozess" className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-28 md:px-12 lg:px-24">

        {/* Header */}
        <FadeIn className="mb-10 grid grid-cols-1 gap-4 sm:mb-20 sm:gap-8 md:grid-cols-2 md:items-end">
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="eyebrow w-fit">
              Prozess
            </Badge>
            <h2 className="display-lg">
              In drei Schritten zu Ihrer Lösung.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Jede Anfrage wird einzeln geprüft. Ich melde mich in der Regel innerhalb von 24 Stunden.
          </p>
        </FadeIn>

        {/* Steps */}
        <Stagger className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {brand.process.map((step) => (
            <StaggerItem key={step.step}>
              <div className="group relative overflow-hidden py-10 md:px-10 md:py-12 md:first:pl-0 md:last:pr-0 lg:px-14 lg:first:pl-0 lg:last:pr-0">

                {/* Giant background number */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-2 right-0 select-none font-light leading-none text-foreground/[0.04] transition-opacity duration-700 group-hover:text-foreground/[0.07]"
                  style={{ fontSize: "clamp(7rem, 14vw, 12rem)" }}
                >
                  {step.step}
                </span>

                {/* Content */}
                <div className="relative flex flex-col gap-5">
                  <span className="eyebrow text-brand">{step.step}</span>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  <ul className="mt-1 flex flex-col gap-1.5 border-t border-border pt-4">
                    {step.items.map((item, j) => (
                      <li key={j} className="text-xs text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
