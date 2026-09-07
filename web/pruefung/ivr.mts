import {
  rechneMaurer, rechneEinsatzmittel, stufeAusPunkten, stufeAusSsb,
  punkteMaximalzahl, punkteErwartungszahl, LEERE_EINGABEN, formatPunkte, formatZahl,
} from "../src/lib/ivr.ts";

let fehler = 0;
const pruefe = (name: string, ist: unknown, soll: unknown) => {
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if (!ok) fehler++;
  console.log(`${ok ? "OK  " : "FEHL"} ${name}: ${JSON.stringify(ist)}${ok ? "" : ` (erwartet ${JSON.stringify(soll)})`}`);
};

// Beispiel 1: Theater im ausverkauften Schauspielhaus, 1250 Plätze -> 1,6 Punkte
const b1 = rechneMaurer({ ...LEERE_EINGABEN, art: "schauspiel-theater", ort: "gebaeude",
  maxQuelle: "zahl", maxZahl: 1250, erwartetQuelle: "zahl", erwartetZahl: 1250 });
pruefe("B1 Zeile 1", b1.zeile1, 3);
pruefe("B1 Zeile 2", b1.zeile2, 3);
pruefe("B1 Zeile 3", b1.zeile3, 2);
pruefe("B1 Gesamt", b1.gesamt, 1.6);
pruefe("B1 Stufe", b1.stufe, 0);

// Beispiel 2: Benefiz-Rockkonzert, Messehalle 10 000 Plätze, 8000 erwartet,
// Bundespräsident nimmt teil -> 38 Punkte
const b2 = rechneMaurer({ ...LEERE_EINGABEN, art: "rockkonzert", ort: "gebaeude",
  maxQuelle: "zahl", maxZahl: 10000, erwartetQuelle: "zahl", erwartetZahl: 8000, prominente: 1 });
pruefe("B2 Zeile 1", b2.zeile1, 6);
pruefe("B2 Zeile 2", b2.zeile2, 6);
pruefe("B2 Zeile 3", b2.zeile3, 16);
pruefe("B2 Zeile 5", b2.zeile5, 28);
pruefe("B2 Zeile 6", b2.zeile6, 10);
pruefe("B2 Gesamt", b2.gesamt, 38);
pruefe("B2 Stufe", b2.stufe, 3);

// Beispiel 3: Stadtfest auf 3000 m2 -> 7,6 Punkte
const b3 = rechneMaurer({ ...LEERE_EINGABEN, art: "stadtteilfest", ort: "freigelaende",
  flaeche: 3000, maxQuelle: "flaeche", erwartetQuelle: "flaeche" });
pruefe("B3 zulaessig aus Flaeche", b3.zeile1Basis, 12000);
pruefe("B3 Zeile 1", b3.zeile1, 7);
pruefe("B3 erwartet aus Flaeche", b3.zeile3Basis, 6000);
pruefe("B3 Zeile 3", b3.zeile3, 12);
pruefe("B3 Gesamt", b3.gesamt, 7.6);
pruefe("B3 Stufe", b3.stufe, 2);

// Tabelle 1, Randwerte
pruefe("T1 500", punkteMaximalzahl(500), 1);
pruefe("T1 501", punkteMaximalzahl(501), 2);
pruefe("T1 50000", punkteMaximalzahl(50000), 10);
pruefe("T1 60000", punkteMaximalzahl(60000), 11);
pruefe("T1 61000", punkteMaximalzahl(61000), 12);
pruefe("Zeile3 499", punkteErwartungszahl(499), 0);
pruefe("Zeile3 1000", punkteErwartungszahl(1000), 2);

// Ausbaustufen, Randwerte
pruefe("Stufe bei 2,0", stufeAusPunkten(2), 0);
pruefe("Stufe bei 2,1", stufeAusPunkten(2.1), 1);
pruefe("Stufe bei 4,0", stufeAusPunkten(4), 1);
pruefe("Stufe bei 4,1", stufeAusPunkten(4.1), 2);
pruefe("Stufe bei 30,0", stufeAusPunkten(30), 2);
pruefe("Stufe bei 30,1", stufeAusPunkten(30.1), 3);

// Anhang 4, Randwerte. Kein KTW in der Ausgabe.
pruefe("Mittel 1,6", rechneEinsatzmittel(1.6), { samariterMin: 0, samariterMax: 0, rettungswagen: 0, notaerzte: 0, einsatzleitung: "keine", ueberTabelle: false });
pruefe("Mittel 7,6", rechneEinsatzmittel(7.6), { samariterMin: 5, samariterMax: 5, rettungswagen: 1, notaerzte: 0, einsatzleitung: "keine", ueberTabelle: false });
pruefe("Mittel 38",  rechneEinsatzmittel(38),  { samariterMin: 20, samariterMax: 20, rettungswagen: 2, notaerzte: 2, einsatzleitung: "reduziert", ueberTabelle: false });
pruefe("Mittel 4,0", rechneEinsatzmittel(4),   { samariterMin: 1, samariterMax: 3, rettungswagen: 0, notaerzte: 0, einsatzleitung: "keine", ueberTabelle: false });
pruefe("Mittel 145", rechneEinsatzmittel(145), { samariterMin: 160, samariterMax: 160, rettungswagen: 7, notaerzte: 5, einsatzleitung: "voll", ueberTabelle: true });

// SSB, Beispiel Anhang 2-2 mit 11 Ja-Antworten -> Stufe 2
pruefe("SSB 11 Ja", stufeAusSsb(11), 2);
pruefe("SSB 4 Ja", stufeAusSsb(4), 0);
pruefe("SSB 6 Ja", stufeAusSsb(6), 1);
pruefe("SSB 13 Ja", stufeAusSsb(13), 3);

// Darstellung
pruefe("Format 7,6", formatPunkte(7.6), "7,6");
pruefe("Format 28", formatPunkte(28), "28");
pruefe("Format 1,65", formatPunkte(1.65), "1,65");
pruefe("Zahl 12000", formatZahl(12000), "12'000");

console.log(fehler === 0 ? "\nAlle Prüfungen bestanden." : `\n${fehler} Prüfung(en) fehlgeschlagen.`);
process.exit(fehler === 0 ? 0 : 1);
