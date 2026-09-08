import { brand } from "@/data/brand";
import { Anziehen } from "@/components/sections/Anziehen";

/**
 * Wer dahintersteht. Die Kernaussage der Seite, „Wissen aus der Praxis",
 * braucht ein Gesicht, sonst bleibt sie Behauptung. Das Bild zieht sich beim
 * Scrollen an, von Zivil zu Helm, Jacke, Weste und Handschuhen; die Bilder
 * und das Haften liegen in `Anziehen`, der Text bleibt hier serverseitig.
 */
export function Person() {
  const p = brand.person;
  return (
    <section id="person" className="border-t border-border">
      <Anziehen>
        <div className="flex max-w-[60ch] flex-col gap-3 md:gap-4">
          <h2 className="display-lg">Wer dahintersteht.</h2>
          <p className="text-2xl font-light tracking-tight sm:text-3xl">{p.name}</p>
          <p className="text-sm text-muted-foreground">{p.role}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
          <p className="text-sm text-muted-foreground">
            {brand.location}, {brand.region}.
          </p>
        </div>
      </Anziehen>
    </section>
  );
}
