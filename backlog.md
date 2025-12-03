## [Playwright] Gemeinsamen Config-Builder einführen
STATUS: done – Neuer `buildTemplatePlaywrightConfig` Helper stellt gemeinsame Defaults (Use-Options, Projects, Reporter-Logik) bereit und alle Templates nutzen ihn.
**Beschreibung:** Die nahezu identischen `playwright.config.ts` Dateien der Templates sollen über einen gemeinsamen Helper aus `@test-platform/core` erzeugt werden (Default-Use-Options, Projects, Reporter-Logik). Dabei werden wiederverwendbare Defaults (Viewport, Headless, Video, Traces) zentral gepflegt.
**Nutzen:** Reduziert Duplication, stellt konsistente Standards über alle Templates sicher und verringert Fehler bei zukünftigen Anpassungen.
**Aufwand:** Mittel
**Risiko/Abhängigkeiten:** Muss abwärtskompatibel zu bestehenden Projekten bleiben; ggf. Anpassung von Imports in Templates nötig.

## [Playwright] Projektweite Fixtures & Auth-Flows konsolidieren
**Beschreibung:** Rollenbasierte Logins (Admin/Editor/Viewer/Merchant) sollen als wiederverwendbare Fixtures in einem `tests/fixtures`-Paket bereitgestellt werden. Login-Selektoren und -Wege werden je Template parametrierbar gemacht und die Example-Tests nutzen diese Fixtures.
**Nutzen:** Höhere Wiederverwendbarkeit, weniger Boilerplate in Tests, stabilere Auth-Setups mit klaren Timeouts und Fehlerberichten.
**Aufwand:** Mittel
**Risiko/Abhängigkeiten:** Erfordert Abgleich mit realen Apps, Anpassung der Beispieltests und global-setup Hooks.

## [DX] Einheitliche Environment-Dokumentation & Beispiele
STATUS: done – Alle `.env.example.*` Dateien listen Laufzeit-Flags konsistent, `env-loader` validiert HEADLESS/TEST_SUITE/TEST_TAG und README beschreibt die Nutzung.
**Beschreibung:** `.env.example.*` Dateien sollen alle aktuell genutzten Flags (z.B. HEADLESS, Video/Trace-Schalter, Stage-spezifische URLs) konsistent auflisten und kurz erläutern. Ergänzend sollte die README die Nutzung von `NODE_ENV`/`TEST_SUITE`/`TEST_TAG` dokumentieren.
**Nutzen:** Schnellere lokale Einrichtung, weniger Validierungsfehler durch fehlende Variablen, klarere CI-Konfiguration.
**Aufwand:** Klein
**Risiko/Abhängigkeiten:** Muss mit `env-loader` Validierung abgeglichen werden.

## [PHP] Lightweight Test-Daten-Seeds
**Beschreibung:** Für die PHP-Beispielanwendungen sollen schlanke Seeder/Fixtures bereitgestellt werden (z.B. Demo-Benutzer und Demo-Artikel), damit Playwright-Tests deterministische Daten vorfinden.
**Nutzen:** Stabilere Tests ohne Abhängigkeit von manuell gepflegten Daten, erleichtert lokale Reproduktion.
**Aufwand:** Mittel
**Risiko/Abhängigkeiten:** Hängt von bestehender PHP-App-Struktur ab, benötigt ggf. CLI/DB-Zugriff in CI.
