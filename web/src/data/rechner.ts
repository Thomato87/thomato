import { brand } from "@/data/brand";

/**
 * Inhalte des Sanitätsdienst-Rechners unter /sanitaetsdienst-rechner.
 *
 * Getrennt von brand.ts, weil es eine Unterseite beschreibt und nicht die
 * Marke. Texte werden hier geändert, nicht in den Komponenten, gleiche Regel
 * wie bei brand.ts.
 *
 * Der erklärende Teil trägt die Seite in der Suche. Der Rechner allein ist
 * dafür zu wenig Inhalt.
 */
export const rechner = {
  pfad: "/sanitaetsdienst-rechner",
  name: "Sanitätsdienst-Rechner",

  titel: "Sanitätsdienst berechnen für Ihre Veranstaltung",
  beschreibung:
    "Wie viel Sanitätsdienst braucht Ihr Anlass? Kostenloser Rechner nach IVR-Richtlinie: Ausbaustufe, Personal und Rechenweg in zwei Minuten.",
  schluesselwoerter:
    "Sanitätsdienst berechnen, wie viele Sanitäter Veranstaltung, Sanitätsposten berechnen, Sanitätskonzept Veranstaltung, IVR Punkteschema, Sanitätsdienst Veranstaltung Schweiz, Anlassbewilligung Sanität, Samariter Anlass",

  h1: "Wie viel Sanitätsdienst braucht Ihre Veranstaltung?",
  vorspann:
    "Geben Sie Art, Platzangebot und erwartete Besucherzahl Ihres Anlasses ein. Sie erhalten eine Einschätzung nach dem Punkteschema der IVR-Richtlinie, mit Anzahl Personen, nötiger Qualifikation und Transportmitteln.",
  vorspannZwei:
    "Sie brauchen dafür kein Vorwissen. Jede Frage sagt Ihnen, was gemeint ist, und am Ende können Sie jede Zahl bis zur Zeile in der Richtlinie zurückverfolgen.",

  preis: "CHF 450 bis 900",

  quelle: {
    titel:
      "Richtlinien für die Organisation des Sanitätsdienstes bei Veranstaltungen",
    herausgeber: "Interverband für Rettungswesen IVR",
    ausgabe: "Ausgabe 2017",
    url: "https://www.ivr-ias.ch",
  },

  /** Der erklärende Teil unter dem Rechner. */
  erklaerung: [
    {
      titel: "Warum die Besucherzahl allein nicht reicht",
      absaetze: [
        "Ein Anlass mit 3000 Besuchern kann harmlos sein oder anspruchsvoll. Das Punkteschema fragt deshalb nicht nur, wie viele kommen, sondern auch, wie viele überhaupt Platz hätten, ob drinnen oder draussen gefeiert wird und was gefeiert wird.",
        "Das Platzangebot zählt getrennt von der erwarteten Zahl, weil ein halbvoller Saal andere Wege und Ausgänge hat als ein voller. In geschlossenen Gebäuden zählt es sogar doppelt. Und die Art der Veranstaltung wird gewichtet: ein Reitturnier zählt am wenigsten, ein Rockkonzert mit dem Zwölffachen davon am meisten.",
        "Dazu kommen zwei Zuschläge, die selten greifen, aber schwer wiegen: prominente Gäste mit Sicherheitsauflagen und polizeiliche Erkenntnisse zur Gewaltbereitschaft.",
      ],
    },
    {
      titel: "Was die vier Ausbaustufen bedeuten",
      absaetze: [
        "Stufe 0 heisst, dass auf einen Sanitätsdienst vor Ort verzichtet werden kann. Die Alarmierung läuft im Notfall über die Sanitätsnotrufzentrale 144 wie im Alltag.",
        "Stufe 1 ist der klassische Samariterposten: ein oder mehrere Sanitätsposten mit je mindestens zwei Personen, die Leitung mit der Ausbildung First Aid Stufe 2 IVR oder gleichwertig. Bei weitläufigem Gelände kommen Patrouillen dazu.",
        "Stufe 2 verstärkt diese Posten mit Fachpersonal. Rettungssanitäter und bei Bedarf Ärzte übernehmen Verantwortung und Triage. Liegt der Ort weit von den Rettungsdiensten entfernt, kommt ein Rettungsfahrzeug mit Besatzung dazu.",
        "Stufe 3 verlangt ein eigenes Einsatzkonzept mit professioneller Einsatzleitung, mobilen Patrouillen, Transportmitteln vor Ort und bei Bedarf einer eingerichteten Sanitätshilfsstelle auf dem Gelände.",
      ],
    },
    {
      titel: "Was die Gemeinde für die Anlassbewilligung verlangt",
      absaetze: [
        "Gesetzliche Vorschriften zum Sanitätsdienst bei Veranstaltungen gibt es nur in wenigen Kantonen. Die Auflagen kommen fast immer über das Bewilligungsverfahren der Gemeinde, und was dort steht, geht dem Punkteschema vor.",
        "In der Regel verlangt die Gemeinde eine Sanitätsstelle, bei grösseren Anlässen zusätzlich ein schriftliches Sanitätskonzept. Kosten und Verantwortung trägt der Veranstalter.",
        "Die Richtlinie empfiehlt, Rettungsdienste, Sanitätsnotrufzentrale 144, ärztlichen Notfalldienst und Spitäler mindestens drei Monate vorher zu informieren, bei Grossanlässen sechs. Wer damit zu spät kommt, findet niemanden mehr.",
      ],
    },
    {
      titel: "Was in einem Sanitätskonzept steht",
      absaetze: [
        "Ein brauchbares Konzept führt von der Beschreibung über die Beurteilung zur Handlung. In Stichworten: Ausgangslage mit Gelände und Fahrzeit zum Spital, Einstufung der Veranstaltung, vorhandene Ressourcen, präventive Massnahmen, Gefahrenpotenziale, mögliche Notfälle mit Risikomatrix, Kommunikation und Funknetz, Sammelplätze, Ablauf bei Einzelfall und Grossereignis, Evakuation mit Durchsagetext, Übersichtsplan, Alarm- und Nummernliste, Verteiler mit Zuständigkeiten.",
        "Der Unterschied zwischen einem Konzept und einer Textvorlage liegt nicht in der Gliederung. Er liegt darin, ob die Zahlen darin aus dem konkreten Anlass stammen.",
      ],
    },
    {
      titel: "Was in solchen Konzepten erfahrungsgemäss fehlt",
      absaetze: [
        "Am häufigsten fehlen die Zahlen zum Personal. Formulierungen wie «die Anzahl richtet sich nach den Anforderungen des Sanitätsdienstes» stehen oft genau dort, wo die Kernaussage stehen müsste. Ein Konzept muss sagen, wie viele Personen mit welcher Qualifikation zu welchen Zeiten anwesend sind.",
        "Zweitens werden Leistungen zugesagt, für die keine Ressource hinterlegt ist. Wer volle Reanimationsbereitschaft verspricht, in den Ressourcen aber weder Notarzt noch die nötige Qualifikation aufführt, schafft ein Haftungsrisiko statt Sicherheit.",
        "Drittens rechnet die Risikomatrix nicht auf. Werte, die es im Schema gar nicht gibt, oder ein Risiko, das nach den Massnahmen höher steht als davor. Bei jeder Zeile muss gelten: Eintrittswahrscheinlichkeit mal Schadensausmass ergibt die Zahl, und nachher ist kleiner als vorher.",
        "Dazu kommen widersprüchliche Checklisten, unbesetzte Schlüsselrollen und fehlende Pläne, auf die das Dokument selbst verweist. Das sind keine Schönheitsfehler. Im Ereignisfall greift jemand zur falschen Liste.",
        "Der Nachweis der Bemessung gehört ins Konzept, nicht nur ihr Ergebnis. Wer die Punktzahl ausweist, macht die Bemessung überprüfbar und im Streitfall belegbar. Genau dafür ist dieser Rechner da.",
      ],
    },
  ],

  /** Häufige Fragen. Werden zusätzlich als strukturierte Daten ausgeliefert. */
  faq: [
    {
      frage: "Ab welcher Grösse braucht meine Veranstaltung einen Sanitätsdienst?",
      antwort:
        "Eine feste Zahl gibt es nicht. Massgebend sind Besucherzahl, Platzangebot, Art des Anlasses und weitere Faktoren. Die Richtlinie nennt fünf Bedingungen, die gleichzeitig erfüllt sein müssen, damit gar kein Sanitätsdienst nötig ist: weniger als 1500 Besucher, höchstens drei Stunden Dauer, höchstens zehn Minuten Fahrzeit zur notärztlichen Versorgung, geringes Verletzungsrisiko und keine Risikogruppen.",
    },
    {
      frage: "Was ist das Punkteschema nach Maurer?",
      antwort:
        "Ein Verfahren, das die von einer Veranstaltung ausgehenden Risiken in Punkte übersetzt. Es stammt von Klaus Maurer und wird von den Richtlinien des Interverbands für Rettungswesen für grössere Veranstaltungen empfohlen. Aus der Punktzahl folgen die Ausbaustufe und der Bedarf an Personal, Rettungswagen und Notärzten. Für kleinere Anlässe empfiehlt die Richtlinie zusätzlich den Fragebogen des Samariterbundes, den dieser Rechner als Gegenprobe mitführt.",
    },
    {
      frage: "Wer entscheidet, was ich brauche?",
      antwort:
        "Die Bewilligungsbehörde Ihrer Gemeinde. Das Punkteschema liefert die fachliche Grundlage für die Beurteilung, ist aber eine Empfehlung und keine Vorschrift. Stimmen Sie das Ergebnis mit dem regionalen Rettungsdienst und Ihrer Gemeinde ab.",
    },
    {
      frage: "Brauche ich ein Sanitätskonzept oder ein Sicherheitskonzept?",
      antwort:
        "Das Sanitätskonzept regelt die sanitätsdienstliche Absicherung: wie viele Leute mit welcher Qualifikation, wo, wann, mit welchem Material und welchem Transportmittel. Das Sicherheitskonzept regelt Ordnungsdienst, Zutritt, Personenlenkung, Brandschutz und Verkehr. Darüber steht das Notfallkonzept mit Alarmierung, Krisenstab, Kommunikation und Evakuation. Die Gemeinde verlangt meist das Sanitätskonzept, bei grösseren Anlässen alle drei.",
    },
    {
      frage: "Was kostet ein Sanitätskonzept?",
      antwort:
        "Bei mir CHF 450 bis 900, je nach Grösse des Anlasses und ob eine Begehung nötig ist.",
    },
    {
      frage: "Führen Sie den Sanitätsdienst auch durch?",
      antwort:
        "Nein. Ich erstelle das Konzept und sage Ihnen, welche Anbieter in der Region für die Durchführung in Frage kommen.",
    },
    {
      frage: "Werden meine Eingaben gespeichert?",
      antwort:
        "Nein. Die Berechnung läuft vollständig in Ihrem Browser. Erst wenn Sie das Ergebnis als PDF per Mail anfordern, werden Ihre Angaben übermittelt.",
    },
  ],

  /** Abschluss mit dem Angebot. */
  abschluss: {
    titel: "Aus der Zahl ein Konzept machen",
    absaetze: [
      "Der Rechner sagt Ihnen, welche Ausbaustufe Ihr Anlass erreicht. Was die Gemeinde sehen will, ist ein Konzept, das diese Bemessung ausweist und daraus Posten, Personal, Abläufe und Alarmierung ableitet.",
      "Genau das schreibe ich. Aus über 15 Jahren Rettungsdienst, ohne Textbausteine, auf Ihre Lage geschrieben.",
    ],
    hinweis:
      "Sanitätskonzept nach IVR-Richtlinie: CHF 450 bis 900, je nach Grösse und ob eine Begehung nötig ist.",
    cta: { label: "Anfrage stellen", href: "/#kontakt" },
    zweit: { label: "Alle Leistungen ansehen", href: "/#sicherheit" },
  },

} as const;

export const rechnerUrl = `${brand.meta.url}${rechner.pfad}`;
