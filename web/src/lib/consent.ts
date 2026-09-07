/**
 * Consent state for statistics/analytics.
 *
 * Design decisions:
 * - Nothing analytics-related is loaded until the visitor grants it, so no
 *   analytics cookie exists before consent. That is stricter than Consent Mode
 *   defaults and matches the legal basis named in the Datenschutzerklärung
 *   (Einwilligung).
 * - The choice itself lives in localStorage, not a cookie: it is a purely local
 *   preference and never travels to the server.
 * - Every accessor is guarded — localStorage throws in some privacy modes.
 */

export const CONSENT_STORAGE_KEY = "thomato.consent.v1";
export const CONSENT_EVENT = "thomato:consent-change";
export const CONSENT_REOPEN_EVENT = "thomato:consent-reopen";

/** Bump when the categories change, so stale choices are re-asked. */
export const CONSENT_VERSION = 1;

export type Consent = {
  version: number;
  /** Always true — required for the site to function. Kept explicit for clarity. */
  necessary: true;
  /** Reach measurement. Off unless the visitor actively turns it on. */
  statistics: boolean;
  decidedAt: string;
};

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(statistics: boolean): Consent {
  const previous = readConsent();
  const value: Consent = {
    version: CONSENT_VERSION,
    necessary: true,
    statistics,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage: the choice holds for this page view only.
  }

  if (!statistics) {
    clearAnalyticsCookies();

    // Unmounting <Script> does not remove the injected tag, and gtag stays
    // resident once evaluated — it would keep reporting after a withdrawal.
    // Denying via Consent Mode stops cookie use immediately; the reload is what
    // actually removes the runtime. Only on a real withdrawal, so a first-visit
    // "Nur notwendige" never reloads the page under the visitor.
    if (previous?.statistics) {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
      window.location.reload();
      return value;
    }
  }

  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
  return value;
}

/**
 * Reopen the banner — used by the "Cookie-Einstellungen" link in the footer.
 * Deliberately keeps the stored choice: writeConsent needs it to tell a genuine
 * withdrawal (granted -> denied) from a first-time decline, and the banner
 * prefills the switch from it.
 */
export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT));
}

/**
 * Withdrawing consent has to actually remove what was set, otherwise the
 * identifier survives the refusal. Analytics cookies are host-scoped, so they
 * are cleared on the exact domain and on the registrable domain.
 */
export function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0]?.trim())
    .filter((n): n is string => !!n && (n.startsWith("_ga") || n === "_gid"));

  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
