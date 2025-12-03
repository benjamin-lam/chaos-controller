# Codex Review

## Kurzüberblick
- Playwright-Setup nutzt zentrale Defaults aus `@test-platform/core`, die Templates behalten aber noch viel Duplikation in den Configs.
- Environment-Handling ist robust (zod-Validierung, stage-basierte Files), aber die Beispiel-Tests nutzen die Variablen nur punktuell.
- Beispiel-Tests demonstrieren gängige Flows, setzen jedoch oft generische CSS-Selektoren und manuelle Warte-Logik ein.
- Reporter/CI-Integration ist vorbereitet (lokal vs. CI Reporter, Tagging), Trace/Screenshot-Flags sind bereits vorhanden.

## Stärken
- Zentrale Env-Validierung mit Stages und hilfreichen Fehlermeldungen verhindert Fehlkonfigurationen frühzeitig.
- Testmatrix/Projects und Reporter sind vorkonfiguriert und erlauben Smoke/A11y/Desktop/Mobile schnell zu aktivieren.
- Gemeinsame Utils (z.B. `TestUtils.waitForNetworkIdle`) und Config-Presets erleichtern das Bootstrapping neuer Suites.

## Schwächen / Risiken
- Drei separate `playwright.config.ts` Dateien duplizieren identische Use-Defaults und Projektdefinitionen.
- Beispiel-Tests mischen CSS-Selektoren und direkte `.click()`-Aufrufe ohne vorherige Sichtbarkeitsprüfungen; das erhöht Flakiness.
- Login- und Daten-Flows sind nicht als Fixtures oder Page Objects gekapselt, wodurch Konsistenz und Wartbarkeit leiden.
- `.env.example` Dateien listen nicht alle verfügbaren Flags (z.B. HEADLESS/Trace/Video), was zu Unsicherheit bei der Nutzung führt.

## Empfohlene nächste Schritte
- Gemeinsamen Playwright-Config-Builder in `@test-platform/core` einführen und Templates darauf umstellen (siehe Backlog: Gemeinsamen Config-Builder einführen).
- Rollenbasierte Login-/Daten-Fixtures bereitstellen und Beispiel-Tests darauf aufbauen (siehe Backlog: Projektweite Fixtures & Auth-Flows konsolidieren).
- Environment-Dokumentation harmonisieren und alle Flags sichtbar machen (siehe Backlog: Einheitliche Environment-Dokumentation & Beispiele).
- Für die PHP-Apps deterministische Testdaten bereitstellen (siehe Backlog: Lightweight Test-Daten-Seeds).

## Score (optional)
- Playwright-Setup: 7/10
- Testqualität (Lesbarkeit & Wartbarkeit): 6/10
- DX/Struktur (Ordner, Config, Wiederverwendbarkeit): 6/10

## Umgesetzte Tickets (Session)
- [Playwright] Gemeinsamen Config-Builder einführen – zentraler Builder in `@test-platform/core` eingeführt und alle Templates darauf umgestellt.
- [DX] Einheitliche Environment-Dokumentation & Beispiele – `.env.example.*` Dateien um Laufzeit-Flags ergänzt, Validierung erweitert und README dokumentiert.
