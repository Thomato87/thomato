import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Die Schriften für das Vorschaubild liegen ausserhalb von public und werden
  // per fs gelesen – ohne diesen Eintrag fehlen sie, falls das Bild einmal zur
  // Laufzeit statt beim Build erzeugt wird.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/*.ttf"],
    "/twitter-image": ["./src/assets/fonts/*.ttf"],
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
