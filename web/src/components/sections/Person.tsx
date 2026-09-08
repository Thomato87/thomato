import { FadeIn } from "@/lib/motion";
import { brand } from "@/data/brand";

/**
 * Wer dahintersteht. Die Kernaussage der Seite, „Wissen aus der Praxis",
 * braucht ein Gesicht, sonst bleibt sie Behauptung. Der Platz für ein Foto
 * ist die linke Spalte; bis es da ist, trägt sie die Überschrift allein.
 */
export function Person() {
  const p = brand.person;
  return (
    <section id="person" className="border-t border-border">
      <FadeIn className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-28 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <h2 className="display-lg">Wer dahintersteht.</h2>
          <div className="flex max-w-[65ch] flex-col gap-4">
            <p className="text-2xl font-light tracking-tight sm:text-3xl">{p.name}</p>
            <p className="text-sm text-muted-foreground">{p.role}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
            <p className="text-sm text-muted-foreground">
              {brand.location}, {brand.region}.
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
