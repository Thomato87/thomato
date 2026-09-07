"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type Consent,
} from "@/lib/consent";

/**
 * localStorage is an external store, so it is read through useSyncExternalStore
 * rather than an effect. That keeps the server render and hydration identical
 * (both see "not ready"), so the banner never flashes for a visitor who already
 * decided, and no state is set during render or in an effect.
 */

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  // Another tab may have decided in the meantime.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Returns the raw string so the snapshot stays referentially stable. */
function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

const getServerSnapshot = (): string | null => null;

/** A hydration flag with no effect and no state: false on the server, true on the client. */
const neverChanges = () => () => {};

export function useConsent(): { consent: Consent | null; ready: boolean } {
  const ready = useSyncExternalStore(
    neverChanges,
    () => true,
    () => false
  );
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const consent = useMemo<Consent | null>(() => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Consent;
      return parsed?.version === CONSENT_VERSION ? parsed : null;
    } catch {
      return null;
    }
  }, [raw]);

  return { consent, ready };
}
