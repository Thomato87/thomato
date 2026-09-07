"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatZahl } from "@/lib/ivr";

/* ─── Gemeinsame Hülle ──────────────────────────────────────────────────── */

export function Feld({
  label,
  hinweis,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hinweis?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {hinweis ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          {hinweis}
        </p>
      ) : null}
      {children}
    </div>
  );
}

const eingabeKlassen =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-base text-foreground transition-colors placeholder:text-muted-foreground/70 hover:border-muted-foreground/50 focus:border-brand focus:outline-none";

/* ─── Zahl ──────────────────────────────────────────────────────────────── */

/**
 * Zahlenfeld mit Schweizer Tausendertrennung. Solange das Feld den Fokus hat,
 * bleiben die Ziffern roh stehen, damit der Textcursor beim Tippen nicht
 * springt. Erst beim Verlassen erscheint die gruppierte Fassung.
 */
export function ZahlFeld({
  id,
  label,
  hinweis,
  einheit,
  wert,
  onWert,
  placeholder,
  max,
}: {
  id: string;
  label: string;
  hinweis?: React.ReactNode;
  einheit?: string;
  wert: number | null;
  onWert: (wert: number | null) => void;
  placeholder?: string;
  max?: number;
}) {
  const [roh, setRoh] = React.useState("");
  const [fokus, setFokus] = React.useState(false);

  // Ohne Fokus zeigt das Feld den gruppierten Wert, mit Fokus die rohen
  // Ziffern. Der rohe Stand wird beim Hineinklicken gesetzt, nicht in einem
  // Effekt nachgezogen.
  const anzeige = fokus ? roh : wert === null ? "" : formatZahl(wert);

  return (
    <Feld label={label} hinweis={hinweis} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={anzeige}
          placeholder={placeholder}
          onFocus={() => {
            setRoh(wert === null ? "" : String(wert));
            setFokus(true);
          }}
          onBlur={() => setFokus(false)}
          onChange={(e) => {
            const ziffern = e.target.value.replace(/\D/g, "");
            setRoh(ziffern);
            if (ziffern === "") {
              onWert(null);
              return;
            }
            const zahl = Number.parseInt(ziffern, 10);
            onWert(max !== undefined ? Math.min(zahl, max) : zahl);
          }}
          className={cn(eingabeKlassen, einheit && "pr-14")}
        />
        {einheit ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
          >
            {einheit}
          </span>
        ) : null}
      </div>
    </Feld>
  );
}

/* ─── Text ──────────────────────────────────────────────────────────────── */

export function TextFeld({
  id,
  label,
  hinweis,
  wert,
  onWert,
  typ = "text",
  placeholder,
  autoComplete,
  required,
  fehler,
}: {
  id: string;
  label: string;
  hinweis?: React.ReactNode;
  wert: string;
  onWert: (wert: string) => void;
  typ?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  fehler?: string;
}) {
  return (
    <Feld label={label} hinweis={hinweis} htmlFor={id}>
      <input
        id={id}
        type={typ}
        value={wert}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={fehler ? true : undefined}
        aria-describedby={fehler ? `${id}-fehler` : undefined}
        onChange={(e) => onWert(e.target.value)}
        className={cn(eingabeKlassen, fehler && "border-destructive")}
      />
      {fehler ? (
        <p id={`${id}-fehler`} className="text-sm text-destructive">
          {fehler}
        </p>
      ) : null}
    </Feld>
  );
}

/* ─── Auswahl ───────────────────────────────────────────────────────────── */

export function AuswahlFeld<T extends string>({
  id,
  label,
  hinweis,
  wert,
  onWert,
  optionen,
}: {
  id: string;
  label: string;
  hinweis?: React.ReactNode;
  wert: T;
  onWert: (wert: T) => void;
  optionen: { id: T; label: string }[];
}) {
  return (
    <Feld label={label} hinweis={hinweis} htmlFor={id}>
      <div className="relative">
        <select
          id={id}
          value={wert}
          onChange={(e) => onWert(e.target.value as T)}
          className={cn(eingabeKlassen, "appearance-none pr-10")}
        >
          {optionen.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-2 w-3 text-muted-foreground"
        >
          <path
            d="M1 1l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </div>
    </Feld>
  );
}

/* ─── Entweder oder ─────────────────────────────────────────────────────── */

export function OptionFeld<T extends string>({
  name,
  label,
  hinweis,
  wert,
  onWert,
  optionen,
}: {
  name: string;
  label: string;
  hinweis?: React.ReactNode;
  wert: T;
  onWert: (wert: T) => void;
  optionen: { id: T; label: string; detail?: string }[];
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      {hinweis ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          {hinweis}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {optionen.map((o) => {
          const aktiv = wert === o.id;
          return (
            <label
              key={o.id}
              className={cn(
                "flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2.5 transition-colors",
                aktiv
                  ? "border-brand bg-brand-muted"
                  : "border-input bg-card hover:border-muted-foreground/50",
              )}
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name={name}
                  value={o.id}
                  checked={aktiv}
                  onChange={() => onWert(o.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
                    aktiv ? "border-brand" : "border-muted-foreground/60",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full bg-brand transition-opacity",
                      aktiv ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
                <span className="text-sm font-medium">{o.label}</span>
              </span>
              {o.detail ? (
                <span className="pl-[26px] text-sm text-muted-foreground">
                  {o.detail}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ─── Ja oder Nein ──────────────────────────────────────────────────────── */

/**
 * Die Richtlinie verlangt für den Samariterbund-Fragebogen, dass jede Zeile
 * beantwortet wird. Ein leeres Kästchen wäre zweideutig, deshalb sind Ja und
 * Nein zwei eigene Schaltflächen und "noch offen" ist ein dritter Zustand.
 */
export function JaNeinFeld({
  name,
  frage,
  wert,
  onWert,
}: {
  name: string;
  frage: string;
  wert: boolean | undefined;
  onWert: (wert: boolean) => void;
}) {
  return (
    <fieldset className="flex items-start justify-between gap-4 border-t border-border py-3 first:border-t-0">
      <legend className="sr-only">{frage}</legend>
      <span
        aria-hidden
        className="text-sm leading-relaxed text-foreground/90"
      >
        {frage}
      </span>
      <div className="flex shrink-0 overflow-hidden rounded-lg border border-input">
        {[
          { id: "ja", label: "Ja", value: true },
          { id: "nein", label: "Nein", value: false },
        ].map((o, i) => {
          const aktiv = wert === o.value;
          return (
            <label
              key={o.id}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors",
                i === 1 && "border-l border-input",
                aktiv
                  ? "bg-brand-solid text-brand-solid-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                checked={aktiv}
                onChange={() => onWert(o.value)}
                className="sr-only"
              />
              <span aria-hidden>{o.label}</span>
              <span className="sr-only">
                {frage} {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ─── Schalter ──────────────────────────────────────────────────────────── */

export function SchalterFeld({
  id,
  label,
  hinweis,
  wert,
  onWert,
}: {
  id: string;
  label: string;
  hinweis?: React.ReactNode;
  wert: boolean;
  onWert: (wert: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-colors",
        wert
          ? "border-brand bg-brand-muted"
          : "border-input bg-card hover:border-muted-foreground/50",
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={wert}
        onChange={(e) => onWert(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-[2px] border transition-colors",
          wert ? "border-brand-solid bg-brand-solid" : "border-muted-foreground/60",
        )}
      >
        <svg viewBox="0 0 10 8" className="h-2 w-2.5 text-brand-solid-foreground">
          <path
            d="M1 4l2.5 2.5L9 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
            className={cn("transition-opacity", wert ? "opacity-100" : "opacity-0")}
          />
        </svg>
      </span>
      <span className="space-y-1">
        <span className="block text-sm font-medium">{label}</span>
        {hinweis ? (
          <span className="block text-sm leading-relaxed text-muted-foreground">
            {hinweis}
          </span>
        ) : null}
      </span>
    </label>
  );
}
