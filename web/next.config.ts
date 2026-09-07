import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Die Schriften für das Vorschaubild liegen ausserhalb von public und werden
  // per fs gelesen – ohne diesen Eintrag fehlen sie, falls das Bild einmal zur
  // Laufzeit statt beim Build erzeugt wird.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/*.ttf"],
    "/twitter-image": ["./src/assets/fonts/*.ttf"],
    // Das PDF des Sanitaetsdienst-Rechners setzt dieselben Schriften.
    "/api/rechner-pdf": ["./src/assets/fonts/*.ttf"],
  },

  // Schreibweisen, die jemand von Hand eintippt oder in eine Mail schreibt.
  // Der Pfad selbst bleibt /sanitatsdienstrechner.
  async redirects() {
    return [
      {
        source: "/sanitaetsdienst-rechner",
        destination: "/sanitatsdienstrechner",
        permanent: true,
      },
      {
        source: "/sanitaetsdienstrechner",
        destination: "/sanitatsdienstrechner",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
