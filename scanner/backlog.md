## [DX] BaseURL-Unterstützung in generierten Specs vereinheitlichen
**Beschreibung:** Die generierten Playwright-Skeletons navigieren per relativer Pfade und setzen implizit eine `baseURL`-Konfiguration voraus. Ohne passend gesetzte `baseURL` schlagen die Tests fehl oder nutzen `about:blank` als Ursprung. Die Generatorlogik sollte optional absolute URLs aus dem Report verwenden oder eine konfigurierbare Basis bereitstellen.
**Nutzen:** Höhere Zuverlässigkeit der Gerüst-Tests ohne manuelle Nacharbeit in der Playwright-Konfiguration.
**Aufwand:** Mittel
**Risiko/Abhängigkeiten:** Abhängig von Playwright-Konfiguration/CI-Setup; erfordert Tests gegen unterschiedliche Basis-URLs.

## [Stabilität] Query-Normalisierung & Crawl-Deduplikation erweitern
**Beschreibung:** Links mit unterschiedlichen Query-Parametern werden als eigene Ziele behandelt und können z. B. langsame Endpunkte (`?delay=...`, `?error=timeout`) mehrfach triggern. Eine konfigurierbare Normalisierung oder explizite Query-Whitelist würde unnötige Requests und Zeitouts reduzieren.
**Nutzen:** Kürzere Laufzeiten und weniger Risiko, Server mit redundanten Requests zu belasten.
**Aufwand:** Mittel
**Risiko/Abhängigkeiten:** Muss pro Projekt steuerbar bleiben, damit legitime Query-basierte Seiten nicht ausgeschlossen werden.

## [Architektur] Parallelisierung des Crawls mit Ressourcen-Limits
**Beschreibung:** Aktuell crawlt der Scanner strikt sequentiell pro Rolle. Eine optionale Parallelisierung (z. B. mehrere Seiten/Tabs mit Rate-Limits) könnte große Sites schneller abdecken, erfordert aber koordinierte Begrenzungen für gleichzeitige Requests.
**Nutzen:** Signifikant kürzere Durchlaufzeiten bei großen Sites.
**Aufwand:** Groß
**Risiko/Abhängigkeiten:** Höheres Risiko für Race Conditions, erhöhte Server-Last; erfordert sorgfältiges Throttling und Fehlertests.

## [DX] CLI-Overrides für baseUrl und Rollenfilter
**Beschreibung:** Der Scanner wird aktuell ausschließlich über `scanner.config.ts` konfiguriert. Ein kleines CLI-Interface (z. B. `--baseUrl`, `--role=public,authenticated`, `--maxDepth`) würde Ad-hoc-Läufe ohne Dateianpassung erlauben.
**Nutzen:** Bessere Developer Experience für lokale Spikes und CI-Trigger, weniger Konfigurationsrauschen im Repo.
**Aufwand:** Mittel
**Risiko/Abhängigkeiten:** Saubere Zusammenführung mit bestehender Config-Validierung nötig; CLI-Parsing sollte optional bleiben, um den jetzigen Default-Flow nicht zu brechen.
