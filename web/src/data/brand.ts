/**
 * Brand data layer – single source of truth derived from /brand/*.md
 * All content, copy, and structure originates from these markdown files.
 *
 * Thomato operates two equal pillars:
 *   1. Medizinische Dienste – on-site medical cover, concepts, consulting, staffing
 *   2. Digitale Lösungen    – web applications for medical organisations
 * Both rest on the same foundation: active paramedic experience.
 */

const medicalOffers = [
  {
    id: "01",
    title: "Sanitätsdienst",
    subtitle: "für Veranstaltungen",
    description:
      "Medizinische Absicherung für Dorffeste, Firmenanlässe und Sportevents – professionell geplant und auf Ihre Veranstaltung abgestimmt.",
    deliverables: [
      "Qualifiziertes Sanitätspersonal vor Ort",
      "Erste medizinische Versorgung bei Notfällen",
      "Koordination mit regionalen Rettungsdiensten",
      "Einsatzplanung nach Veranstaltungsgrösse",
    ],
  },
  {
    id: "02",
    title: "Sicherheitskonzepte",
    subtitle: "für Veranstaltungen & Betriebe",
    description:
      "Strukturierte medizinische Notfallkonzepte basierend auf realer Einsatzerfahrung – für Gemeinden, Firmen und Veranstalter.",
    deliverables: [
      "Analyse der Veranstaltung oder Organisation",
      "Risikoanalyse und medizinische Einsatzplanung",
      "Erstellung eines strukturierten Sicherheitskonzeptes",
      "Empfehlungen für Notfallabläufe und Ressourcen",
    ],
  },
  {
    id: "03",
    title: "Beratung",
    subtitle: "für Gemeinden & Unternehmen",
    description:
      "Fachkundige Beratung zur medizinischen Sicherheit – direkt aus der Praxis des Rettungsdienstes, anwendbar für Ihre Organisation.",
    deliverables: [
      "Analyse bestehender Sicherheitsstrukturen",
      "Empfehlungen für Sicherheits- und Rettungsorganisation",
      "Unterstützung bei der Planung medizinischer Absicherung",
      "Erfahrungsaustausch aus dem aktiven Einsatz",
    ],
  },
  {
    id: "04",
    title: "Springerdienste",
    subtitle: "für Rettungsdienste",
    description:
      "Flexible, qualifizierte Verstärkung für Rettungsdienste bei Personalengpässen – kurzfristig oder geplant einsetzbar.",
    deliverables: [
      "Einsatz als qualifizierter Rettungssanitäter",
      "Kurzfristige oder geplante Verfügbarkeit",
      "Nahtlose Integration in bestehende Teams",
    ],
  },
] as const;

const digitalOffers = [
  {
    id: "01",
    title: "Individualentwicklung",
    subtitle: "Web-Applikationen nach Mass",
    description:
      "Software für den konkreten Ablauf in Ihrem Betrieb – dort, wo Standardlösungen zu starr sind und die Excel-Tabelle längst nicht mehr trägt.",
    deliverables: [
      "Analyse der bestehenden Abläufe vor Ort",
      "Web-Applikation nach Mass, auf jedem Gerät nutzbar",
      "Anbindung an bestehende Systeme und Exporte",
      "Betrieb, Wartung und Weiterentwicklung",
    ],
  },
  {
    id: "02",
    title: "Dienst- & Schichtplanung",
    subtitle: "für Praxen, Dienste & Pflege",
    description:
      "Schichten, Pikett und Verfügbarkeiten an einem Ort – entworfen von jemandem, der selbst im Dienstplan steht.",
    deliverables: [
      "Dienstpläne erstellen, tauschen und freigeben",
      "Verfügbarkeiten und Pikett im Überblick",
      "Benachrichtigung bei jeder Änderung",
      "Auswertung von Stunden und Einsätzen",
    ],
  },
  {
    id: "03",
    title: "Material & Medikamente",
    subtitle: "Bestand, Ablaufdaten, Kontrollen",
    description:
      "Rucksäcke, Fahrzeuge und Lager unter Kontrolle – mit Ablaufdaten, die sich melden, bevor jemand vor einem leeren Fach steht.",
    deliverables: [
      "Bestand nach Standort, Fahrzeug und Rucksack",
      "Ablauf- und Chargenkontrolle mit Vorwarnung",
      "Checklisten für wiederkehrende Kontrollen",
      "Nachbestellung und Verbrauchsauswertung",
    ],
  },
  {
    id: "04",
    title: "Praxis-Websites",
    subtitle: "mit Online-Terminbuchung",
    description:
      "Ein Webauftritt, der Patientinnen und Patienten führt statt aufhält – inklusive Terminvereinbarung und digitalen Formularen.",
    deliverables: [
      "Webauftritt für Praxis oder Betrieb",
      "Online-Terminvereinbarung rund um die Uhr",
      "Digitale Anmelde- und Patientenformulare",
      "Hosting in der Schweiz, DSG-konform",
    ],
  },
] as const;

export const brand = {
  name: "Thomato",
  tagline: "Medizinische Dienste & Software",
  description:
    "Medizinische Absicherung und Web-Applikationen für medizinische Betriebe – beides aus der Praxis des aktiven Rettungsdienstes.",
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
    { label: "Dienste", href: "#dienste" },
    { label: "Software", href: "#software" },
    { label: "Prozess", href: "#prozess" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontakt", href: "#kontakt" },
  ],

  hero: {
    headline: ["Wissen aus der Praxis.", "Für Ihr Unternehmen."],
    body: "Medizinische Absicherung für Gemeinden, Unternehmen und Veranstalter. Web-Applikationen für medizinische Betriebe. Beides aus dem aktiven Dienst heraus.",
    cta: { primary: "Anfrage stellen", secondary: "Leistungen ansehen" },
  },

  trust: [
    { label: "Rettungsdienst-Erfahrung", detail: "Aus aktiven Einsätzen" },
    { label: "Software aus der Praxis", detail: "Kein Branchenfremder" },
    { label: "Flexible Verfügbarkeit", detail: "Kurz- & langfristig" },
    { label: "Schweizer Standard", detail: "IVR-Richtlinien & DSG" },
  ],

  /** Two equal pillars – drives the Leistungen section, nav anchors and contact form. */
  pillars: [
    {
      id: "dienste",
      label: "Medizinische Dienste",
      description:
        "Absicherung, Konzepte und Personal für Gemeinden, Unternehmen und Veranstalter – aus dem aktiven Rettungsdienst.",
      offers: medicalOffers,
    },
    {
      id: "software",
      label: "Digitale Lösungen",
      description:
        "Web-Applikationen für Praxen, Rettungsdienste und Pflegebetriebe – gebaut von jemandem, der ihren Alltag kennt.",
      offers: digitalOffers,
    },
  ],

  /** Flattened for marquee, JSON-LD and anything that needs the full catalogue. */
  offers: [...medicalOffers, ...digitalOffers],

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
        "Risikoanalyse, Einsatz- oder Projektplanung",
        "Kostenlos und unverbindlich",
      ],
      note: "Kostenlos und unverbindlich – auch für Standardanfragen.",
    },
    {
      step: "03",
      title: "Einsatz & Umsetzung",
      description:
        "Thomato ist vor Ort oder liefert die fertige Applikation – zuverlässig, vorbereitet und getestet.",
      items: [
        "Vollständig ausgerüstete Crews",
        "Software in Etappen, jede einzeln abnehmbar",
      ],
      note: "Verfügbar schweizweit, auch kurzfristig.",
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
        "Keine Standardpakete. Jedes Sicherheitskonzept, jeder Sanitätsdienst und jede Applikation wird auf Ihre spezifischen Anforderungen zugeschnitten – in Grösse, Tiefe und Umfang.",
    },
    {
      title: "Volle Verlässlichkeit",
      description:
        "Wir erscheinen. Pünktlich, vorbereitet und mit der nötigen Ausrüstung. Und was wir bauen, läuft auch dann noch, wenn niemand hinschaut. Sicherheit kennt keine Ausnahmen – und keine Entschuldigungen.",
    },
  ],

  faqs: [
    {
      question: "Wie kurzfristig kann ich einen Sanitätsdienst buchen?",
      answer:
        "Wir empfehlen eine Planung von mindestens 4–6 Wochen vor Ihrer Veranstaltung. Bei kurzfristigen Anfragen nehmen Sie bitte direkt Kontakt auf – wir prüfen die Verfügbarkeit umgehend und finden wenn möglich eine Lösung.",
    },
    {
      question: "Was unterscheidet Thomato von einem Samariterverein?",
      answer:
        "Thomato setzt qualifizierte Rettungssanitäter mit aktiver Einsatzerfahrung ein. Das bedeutet strukturierte Einsatzplanung, professionelle Koordination mit Rettungsdiensten und medizinische Kompetenz weit über die Grundversorgung hinaus.",
    },
    {
      question: "Für welche Veranstaltungsgrössen sind Sie geeignet?",
      answer:
        "Für kleinere Veranstaltungen bis rund 100 Personen: Sportevents, Vereinsanlässe und Firmenanlässe.",
    },
    {
      question: "Was kostet ein Sanitätsdienst?",
      answer:
        "Die Kosten hängen von Grösse, Dauer und Art des Einsatzes ab. Wir erstellen für jeden Auftrag eine individuelle, kostenlose und unverbindliche Offerte – ohne versteckte Gebühren.",
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
    {
      question: "Sind eure Mitarbeitenden versichert?",
      answer:
        "Selbstverständlich. Alle eingesetzten Fachkräfte sind berufshaftpflichtversichert und arbeiten nach den Qualitätsstandards des Schweizer Rettungswesens.",
    },
  ],

  /** Grouped options for the contact form select – mirrors the two pillars. */
  serviceGroups: [
    {
      label: "Medizinische Dienste",
      options: [
        "Sanitätsdienst für Veranstaltungen",
        "Sicherheitskonzept",
        "Beratung für Gemeinden / Unternehmen",
        "Springerdienst",
      ],
    },
    {
      label: "Digitale Lösungen",
      options: [
        "Individualentwicklung",
        "Dienst- & Schichtplanung",
        "Material- & Medikamentenverwaltung",
        "Praxis-Website & Terminbuchung",
      ],
    },
    {
      label: "Weiteres",
      options: ["Sonstiges"],
    },
  ],

  meta: {
    title: "Thomato – Medizinische Dienste & Software für den Medizinbereich",
    description:
      "Sanitätsdienste, Sicherheitskonzepte und Rettungsdienstberatung – und Web-Applikationen für Praxen, Rettungsdienste und Pflegebetriebe in der Schweiz.",
    keywords:
      "Sanitätsdienst, Sicherheitskonzept, Rettungsdienst, Veranstaltungssicherheit, Schweiz, medizinische Absicherung, Springerdienst, Web-Applikation, Praxissoftware, Dienstplanung, Materialverwaltung, Individualentwicklung",
    url: "https://thomato.ch",
    ogImage: "/og-image.png",
  },
} as const;

export type Brand = typeof brand;
export type Pillar = (typeof brand.pillars)[number];
export type Offer = (typeof brand.offers)[number];
export type FAQ = (typeof brand.faqs)[number];
export type ProcessStep = (typeof brand.process)[number];
export type Differentiator = (typeof brand.differentiators)[number];
export type TrustItem = (typeof brand.trust)[number];
