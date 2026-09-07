"use client";

import Script from "next/script";
import { useConsent } from "@/hooks/use-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google Analytics 4, loaded only after the visitor grants statistics.
 *
 * The script tag is not rendered at all before consent, so no request reaches
 * Google and no _ga cookie is written until then. Withdrawing consent unmounts
 * the script and clears the cookies (see lib/consent.ts) — the identifier does
 * not outlive the refusal.
 *
 * Set NEXT_PUBLIC_GA_ID (format G-XXXXXXXXXX) to activate. Without it this
 * renders nothing, which is the correct state until a property exists.
 */
export function Analytics() {
  const { consent, ready } = useConsent();

  if (!GA_ID || !ready || !consent?.statistics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
