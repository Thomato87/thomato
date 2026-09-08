/**
 * Brand data layer – single source of truth derived from /brand/*.md
 * All content, copy, and structure originates from these markdown files.
 *
 * Thomato operates two equal pillars:
 *   1. Digitale Lösungen  – websites, small line-of-business apps, operations
 *   2. Sicherheit          – concepts and advisory. No on-site service: any
 *                            wording promising staff would trigger a permit.
 * Both rest on the same foundation: active paramedic experience.
 */

const safetyOffers = [
  {
    id: "01",
    title: "Sanitätskonzept",
    subtitle: "für Veranstaltungen",
    description:
      "Bemessung nach der Richtlinie des Interverbands für Rettungswesen. Sie erhalten ein Konzept, das der Bewilligungsbehörde standhält, und wissen genau, welche Mittel Sie bestellen müssen.",
    deliverables: [
      "Bemessung nach der Richtlinie des Interverbands für Rettungswesen",
      "Ein Konzept, das der Bewilligungsbehörde standhält",
      "Klare Liste der Mittel, die Sie bestellen müssen",
      "Grundlage für Ihr Gesuch um die Anlassbewilligung",
    ],
    link: {
      href: "/sanitaetsdienst-rechner",
      label: "Bedarf selbst berechnen",
    },
  },
  {
    id: "02",
    title: "Sicherheitskonzept",
    subtitle: "für Veranstalter & Gemeinden",
    description:
      "Zufahrten, Alarmierung, Zuständigkeiten und Abläufe für Veranstalter und Gemeinden. Schriftlich, nachvollziehbar, ohne Textbausteine.",
    deliverables: [
      "Zufahrten und Rettungsachsen",
      "Alarmierung und Zuständigkeiten, schriftlich festgehalten",
      "Abläufe für den Ernstfall, nachvollziehbar dokumentiert",
      "Ohne Textbausteine, auf Ihre Lage geschrieben",
    ],
  },
  {
    id: "03",
    title: "Ersthelferorganisation",
    subtitle: "im Betrieb",
    description:
      "Wer alarmiert, wer versorgt, wo liegt das Material und wer prüft es. Wir gehen mit Ihnen durch, was Sie heute haben, und sagen Ihnen, was fehlt.",
    deliverables: [
      "Alarmierung und Zuständigkeiten im Betrieb geklärt",
      "Standort und Prüfung des Notfallmaterials geregelt",
      "Abgleich zwischen dem, was Sie haben, und dem, was fehlt",
      "Schriftliche Empfehlung zum Nachrüsten",
    ],
  },
  {
    id: "04",
    title: "Begehung und Beurteilung",
    subtitle: "Ihrer Notfallabläufe",
    description:
      "Eine Beurteilung Ihrer bestehenden Notfallabläufe vor Ort, mit schriftlichem Bericht und einer Liste der Massnahmen nach Dringlichkeit.",
    deliverables: [
      "Begehung Ihrer Räume und Abläufe",
      "Beurteilung der bestehenden Notfallorganisation",
      "Schriftlicher Bericht",
      "Massnahmenliste nach Dringlichkeit geordnet",
    ],
  },
] as const;

const digitalOffers = [
  {
    id: "01",
    title: "Firmenwebsite",
    subtitle: "auf Wunsch mit Terminbuchung",
    description:
      "Eine Seite, die Ihre Leistungen, Öffnungszeiten und Kontaktwege sauber zeigt. Schnell, auf dem Mobilgerät lesbar, in der Schweiz gehostet. Auf Wunsch mit Terminbuchung.",
    deliverables: [
      "Leistungen, Öffnungszeiten und Kontaktwege auf einen Blick",
      "Auf dem Mobilgerät gleich gut lesbar wie am Bildschirm",
      "Hosting in der Schweiz",
      "Online-Terminbuchung, wenn Sie sie brauchen",
    ],
  },
  {
    id: "02",
    title: "Fachanwendungen",
    subtitle: "Dienstplanung, Material, Medikamente",
    description:
      "Dienst- und Schichtplanung, Material- und Medikamentenverwaltung. Kleine Werkzeuge für Abläufe, die sonst in Tabellen enden.",
    deliverables: [
      "Dienst- und Schichtplanung mit Pikett und Verfügbarkeiten",
      "Material- und Medikamentenverwaltung mit Ablaufkontrolle",
      "Zugeschnitten auf Ihren Ablauf statt umgekehrt",
      "In Etappen gebaut, jede einzeln abnehmbar",
    ],
  },
  {
    id: "03",
    title: "Betrieb und Wartung",
    subtitle: "im monatlichen Abonnement",
    description:
      "Hosting, Domain, Aktualisierungen und Inhaltspflege im Abonnement. Sie haben eine Ansprechperson, kein Ticketsystem.",
    deliverables: [
      "Hosting, Domain und Zertifikate in einer Hand",
      "Sicherheitsupdates und Aktualisierungen laufend",
      "Inhaltspflege auf Wunsch im Abonnement",
      "Eine feste Ansprechperson statt Ticketsystem",
    ],
  },
  {
    id: "04",
    title: "Datenschutz von Anfang an",
    subtitle: "Pflicht, nicht Kür",
    description:
      "Datenschutzerklärung passend zu den tatsächlich eingesetzten Diensten, Auftragsbearbeitungsvertrag und Hosting in der Schweiz. Bei Gesundheitsdaten ist das Pflicht, nicht Kür.",
    deliverables: [
      "Datenschutzerklärung, die zu den eingesetzten Diensten passt",
      "Auftragsbearbeitungsvertrag für die Zusammenarbeit",
      "Hosting in der Schweiz",
      "Verzeichnis der Bearbeitungstätigkeiten als Grundlage",
    ],
  },
] as const;

export const brand = {
  name: "Thomato",
  tagline: "Digitale Lösungen & Notfallorganisation",
  description:
    "Websites und Fachanwendungen für Betriebe im Gesundheitswesen und Konzepte für die Notfallorganisation – beides aus der Praxis des aktiven Rettungsdienstes.",
  established: 2026,
  location: "Schweiz",
  serviceArea:
    "Regionale Gemeinden, Unternehmen und medizinische Betriebe in der Schweiz",

  contact: {
    owner: "Michael Thoma",
    email: "info@thomato.ch",
    phone: "+41 76 447 68 61",
    street: "Fichtenweg 4",
    postalCode: "4542",
    city: "Luterbach",
    country: "Schweiz",
    address: "Fichtenweg 4, 4542 Luterbach",
  },

  /** Last review date of Impressum and Datenschutzerklärung. */
  legalUpdated: "7. September 2026",

  nav: [
    { label: "Software", href: "#software" },
    { label: "Sicherheit", href: "#sicherheit" },
    { label: "Rechner", href: "/sanitaetsdienst-rechner" },
    { label: "Prozess", href: "#prozess" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontakt", href: "#kontakt" },
  ],

  hero: {
    headline: ["Wissen aus der Praxis.", "Für Ihr Unternehmen."],
    body: "Websites und Fachanwendungen für Betriebe im Gesundheitswesen. Sanitäts- und Sicherheitskonzepte für Veranstalter und Gemeinden. Beides aus dem aktiven Dienst heraus.",
    cta: { primary: "Anfrage stellen", secondary: "Leistungen ansehen" },
  },

  trust: [
    { label: "Rettungsdienst-Erfahrung", detail: "Aus aktiven Einsätzen" },
    { label: "Software aus der Praxis", detail: "Kein Branchenfremder" },
    { label: "Eine Ansprechperson", detail: "Kein Ticketsystem" },
    { label: "Schweizer Standard", detail: "IVR-Richtlinien & DSG" },
  ],

  /**
   * Two equal pillars – drives the Leistungen section, nav anchors, contact
   * form, marquee, JSON-LD and the social preview image, all from this order.
   *
   * Digital leads. Per the business plan it is pillar 1: it needs no permit,
   * already has a reference, and does not touch the employer. The medical
   * pillar depends on the Gesundheitsamt and the notice to Grenchen.
   */
  pillars: [
    {
      id: "software",
      label: "Digitale Lösungen",
      description:
        "Websites und Anwendungen für Betriebe, die im Gesundheitswesen arbeiten. Gebaut von jemandem, der Ihre Abläufe kennt.",
      offers: digitalOffers,
    },
    {
      id: "sicherheit",
      label: "Sicherheit und Notfallorganisation",
      description:
        "Konzepte und Beratung aus über 15 Jahren Rettungsdienst. Wir planen, was im Ernstfall funktionieren muss.",
      offers: safetyOffers,
      // Postendienst-Anfragen kommen, weil die Lücke in der Region echt ist.
      // Lieber ehrlich beantworten als ausweichen – und ohne eine Formulierung,
      // die nach Einsatzleistung klingt und eine Bewilligungspflicht auslöst.
      note: "Wir führen selbst keinen Sanitätsdienst an Veranstaltungen durch. Wenn Sie Personal für Ihren Anlass brauchen, erstellen wir Ihnen das Konzept und sagen Ihnen, welche Anbieter in der Region dafür in Frage kommen.",
    },
  ],

  /** Flattened for marquee, JSON-LD and anything that needs the full catalogue. */
  offers: [...digitalOffers, ...safetyOffers],

  process: [
    {
      step: "01",
      title: "Kontaktaufnahme",
      description:
        "Schildern Sie uns Ihren Bedarf – unverbindlich und unkompliziert.",
      items: [
        "Antwort innerhalb von 24 Stunden",
        "Telefonisch, per E-Mail oder Formular",
      ],
      note: "Wir antworten in der Regel noch am selben Werktag.",
    },
    {
      step: "02",
      title: "Bedarfsanalyse",
      description:
        "Wir analysieren Ihre Situation und erstellen ein massgeschneidertes Angebot.",
      items: [
        "Risikoanalyse, Konzept- oder Projektplanung",
        "Kostenlos und unverbindlich",
      ],
      note: "Kostenlos und unverbindlich – auch für Standardanfragen.",
    },
    {
      step: "03",
      title: "Umsetzung",
      description:
        "Sie erhalten das fertige Konzept oder die fertige Applikation – geprüft, dokumentiert und übergeben.",
      items: [
        "Konzepte schriftlich und behördentauglich",
        "Software in Etappen, jede einzeln abnehmbar",
      ],
      note: "Schweizweit, mit einer festen Ansprechperson.",
    },
  ],

  differentiators: [
    {
      title: "Echte Rettungsdienst-Erfahrung",
      description:
        "Unsere Leistungen basieren nicht auf Theorie, sondern auf jahrelanger Praxis im aktiven Rettungsdienst. Das macht den Unterschied – besonders wenn es darauf ankommt.",
    },
    {
      title: "Software, die den Betrieb schon kennt",
      description:
        "Wir haben Dienstpläne getauscht, Rucksäcke kontrolliert und Ablaufdaten übersehen. Deshalb bauen wir Applikationen, die Ihren Ablauf abbilden statt ihn umzubauen – Sie müssen uns Ihre Branche nicht erst erklären.",
    },
    {
      title: "Individuelle Lösungen",
      description:
        "Keine Standardpakete. Jedes Konzept und jede Applikation wird auf Ihre spezifischen Anforderungen zugeschnitten – in Grösse, Tiefe und Umfang.",
    },
    {
      title: "Volle Verlässlichkeit",
      description:
        "Zugesagte Termine halten. Was wir schreiben, hält der Bewilligungsbehörde stand, und was wir bauen, läuft auch dann noch, wenn niemand hinschaut. Sicherheit kennt keine Ausnahmen – und keine Entschuldigungen.",
    },
  ],

  faqs: [
    {
      question: "Führt ihr den Sanitätsdienst an unserem Anlass auch durch?",
      answer:
        "Nein. Wir erstellen das Konzept und bemessen den Bedarf nach der Richtlinie des Interverbands für Rettungswesen. Für die Durchführung sagen wir Ihnen, welche Anbieter in der Region dafür in Frage kommen.",
    },
    {
      question: "Wonach wird ein Sanitätskonzept bemessen?",
      answer:
        "Nach der Richtlinie des Interverbands für Rettungswesen für den Sanitätsdienst bei Veranstaltungen. Das ist die Grundlage, die auch die Gemeinde bei der Anlassbewilligung erwartet – Sie erhalten damit ein Konzept, das der Bewilligungsbehörde standhält.",
    },
    {
      question:
        "Warum sollte ich Software von einem Rettungssanitäter entwickeln lassen?",
      answer:
        "Weil der teuerste Teil eines Softwareprojekts das Erklären ist. Wir kennen Dienstpläne, Materialkontrollen und den Ablauf in einem medizinischen Betrieb aus eigener Erfahrung. Sie beschreiben uns nicht Ihre Branche, sondern nur Ihren konkreten Fall.",
    },
    {
      question: "Wo werden die Daten unserer Applikation gespeichert?",
      answer:
        "In der Schweiz oder im EU-Raum, je nach Anforderung. Wir arbeiten nach dem Schweizer Datenschutzgesetz (DSG). Sind Patientendaten im Spiel, klären wir die Anforderungen vor Projektstart schriftlich ab.",
    },
    {
      question: "Was kostet eine Web-Applikation?",
      answer:
        "Das hängt vom Umfang ab. Wir starten mit einem kostenlosen Erstgespräch und einer Aufwandschätzung in Etappen. Nach jeder Etappe entscheiden Sie, ob es weitergeht – keine Pauschale ins Blaue.",
    },
    {
      question: "Übernehmt ihr auch Wartung und Weiterentwicklung?",
      answer:
        "Ja. Eine Applikation ist mit dem Launch nicht fertig. Wartung, Support und Weiterentwicklung gibt es als monatliche Vereinbarung oder auf Abruf.",
    },
    {
      question: "Übernehmt ihr auch die Koordination mit Behörden?",
      answer:
        "Ja. Auf Wunsch unterstützen wir Sie bei der Kommunikation mit Gemeinden, Polizei und Rettungsdiensten sowie bei der Erstellung behördenkonformer Sicherheitskonzepte.",
    },
  ],

  /** Grouped options for the contact form select – mirrors the two pillars. */
  serviceGroups: [
    {
      label: "Digitale Lösungen",
      options: [
        "Firmenwebsite",
        "Fachanwendung",
        "Betrieb und Wartung",
        "Datenschutz",
      ],
    },
    {
      label: "Sicherheit und Notfallorganisation",
      options: [
        "Sanitätskonzept",
        "Sicherheitskonzept",
        "Ersthelferorganisation",
        "Begehung und Beurteilung",
      ],
    },
    {
      label: "Weiteres",
      options: ["Sonstiges"],
    },
  ],

  meta: {
    title: "Thomato – Digitale Lösungen & Notfallorganisation",
    description:
      "Websites und Fachanwendungen für Praxen, Rettungsdienste und Pflegebetriebe – und Sanitäts-, Sicherheits- und Notfallkonzepte für Veranstalter und Gemeinden in der Schweiz.",
    keywords:
      "Web-Applikation, Praxissoftware, Praxis-Website, Dienstplanung, Materialverwaltung, Fachanwendung, Wartung im Abonnement, Datenschutz Arztpraxis, Schweiz, Sanitätskonzept, Sicherheitskonzept, Notfallorganisation, Ersthelferorganisation, IVR-Richtlinie, Anlassbewilligung",
    url: "https://thomato.ch",
  },
} as const;

export type Brand = typeof brand;
export type Pillar = (typeof brand.pillars)[number];
export type Offer = (typeof brand.offers)[number];
export type FAQ = (typeof brand.faqs)[number];
export type ProcessStep = (typeof brand.process)[number];
export type Differentiator = (typeof brand.differentiators)[number];
export type TrustItem = (typeof brand.trust)[number];
