"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useConsent } from "@/hooks/use-consent";
import { CONSENT_REOPEN_EVENT, writeConsent } from "@/lib/consent";

const reveal = [0.16, 1, 0.3, 1] as const;

export function CookieBanner() {
  const { consent, ready } = useConsent();
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [reopened, setReopened] = useState(false);
  const titleId = useId();
  const reduced = useReducedMotion();

  const open = ready && (consent === null || reopened);

  useEffect(() => {
    const onReopen = () => setReopened(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, onReopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, onReopen);
  }, []);

  const decide = useCallback((value: boolean) => {
    setReopened(false);
    writeConsent(value);
  }, []);

  // Escape declines rather than dismissing: closing without a choice would
  // otherwise read as acceptance.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") decide(consent?.statistics ?? false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, decide, consent?.statistics]);

  // Opening reflects the current setting; a first visit starts from the safe default.
  useEffect(() => {
    if (open) {
      setStatistics(consent?.statistics ?? false);
      setDetails(false);
    }
    // consent is intentionally read only when the banner opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal={false}
          aria-labelledby={titleId}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: reveal }}
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 backdrop-blur-md"
        >
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-24">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              {/* Statement */}
              <div className="flex max-w-2xl flex-col gap-3">
                <h2 id={titleId} className="text-base font-medium tracking-tight">
                  Cookies und Reichweitenmessung
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Für den Betrieb dieser Seite sind keine Cookies nötig. Wenn Sie
                  zustimmen, messe ich mit Google Analytics anonymisiert, welche
                  Inhalte gelesen werden – sonst wird nichts geladen und nichts
                  gespeichert. Ihre Wahl können Sie jederzeit ändern.{" "}
                  <Link
                    href="/datenschutz"
                    className="text-foreground underline underline-offset-4 hover:text-brand transition-colors"
                  >
                    Datenschutzerklärung
                  </Link>
                </p>

                <button
                  type="button"
                  onClick={() => setDetails((v) => !v)}
                  aria-expanded={details}
                  className="eyebrow inline-flex w-fit items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  Details
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      details ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: reveal }}
                      className="overflow-hidden"
                    >
                      <dl className="mt-2 flex max-h-[45vh] flex-col divide-y divide-border overflow-y-auto border-y border-border">
                        <div className="flex items-start justify-between gap-6 py-4">
                          <div className="flex flex-col gap-1">
                            <dt className="text-sm font-medium">Notwendig</dt>
                            <dd className="text-sm leading-relaxed text-muted-foreground">
                              Ihre Theme-Wahl und diese Einwilligung. Beides bleibt
                              lokal in Ihrem Browser und wird nicht übertragen.
                            </dd>
                          </div>
                          <span className="eyebrow shrink-0 pt-1 text-muted-foreground">
                            Immer aktiv
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-6 py-4">
                          <div className="flex flex-col gap-1">
                            <dt className="text-sm font-medium">
                              <label htmlFor="consent-statistics">Statistik</label>
                            </dt>
                            <dd className="text-sm leading-relaxed text-muted-foreground">
                              Google Analytics mit gekürzter IP-Adresse. Zeigt mir,
                              welche Seiten gelesen werden – nicht, wer sie liest.
                            </dd>
                          </div>
                          <Switch
                            id="consent-statistics"
                            checked={statistics}
                            onCheckedChange={setStatistics}
                            className="mt-1 shrink-0"
                          />
                        </div>
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  variant="outline"
                  onClick={() => decide(false)}
                  className="sm:min-w-40"
                >
                  Nur notwendige
                </Button>
                {details ? (
                  <Button onClick={() => decide(statistics)} className="sm:min-w-40">
                    Auswahl speichern
                  </Button>
                ) : (
                  <Button onClick={() => decide(true)} className="sm:min-w-40">
                    Alle akzeptieren
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
