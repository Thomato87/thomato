import Image from "next/image";
import { FadeIn } from "@/lib/motion";
import { brand } from "@/data/brand";

/**
 * Wer dahintersteht. Die Kernaussage der Seite, „Wissen aus der Praxis",
 * braucht ein Gesicht, sonst bleibt sie Behauptung. Das Bild liegt als
 * 4:5-Ausschnitt in `public/`, der Optimierer liefert es passend zur Breite.
 */
export function Person() {
  const p = brand.person;
  return (
    <section id="person" className="border-t border-border">
      <FadeIn className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-28 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-16">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-muted">
            <Image
              src="/michael-thoma.jpg"
              alt={`${p.name}, Rettungssanitäter`}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex max-w-[60ch] flex-col gap-4">
            <h2 className="display-lg">Wer dahintersteht.</h2>
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
