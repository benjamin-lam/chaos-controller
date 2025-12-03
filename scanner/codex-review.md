# Scanner Code Review

## Kurzbewertung
Der Scanner bleibt klar strukturiert (Config/Types/Scanner/Generator) und liefert brauchbare Reports sowie Test-Skeletons. Kleine Robustheitsverbesserungen (deduplizierte Startpfade, bereinigtes Regex-Escaping) erhöhen die Wartbarkeit. Der PHP-Beispielscan konnte mangels laufendem Server/NPM-Registry-Zugriff nicht durchlaufen werden.

## Stärken
- Verständliche Typ- und Konfigurationsstruktur, gut kommentiert und modular.
- Vorsichtige Fehlerbehandlung (best-effort Crawl, Logging, Report-Felder für Fehler).
- Generator produziert nutzbare Test-Skeletons mit Kontextkommentaren.
- Link-Filterung (JS/Data-URIs) und Startpfad-Deduplikation reduzieren unnötige Requests.

## Schwächen
- Generierte Specs navigieren mit relativen Pfaden und setzen eine korrekt gesetzte `baseURL` voraus (Backlog: BaseURL-Unterstützung vereinheitlichen).
- Query-Parameter werden nicht normalisiert; potenziell Duplicate-/Slow-Endpoints (Backlog: Query-Normalisierung & Deduplication).
- Crawl läuft strikt sequentiell; große Sites dauern entsprechend länger (Backlog: Parallelisierung mit Limits).
- Keine CLI-Overrides für schnelle Basis-URL/Rollenwechsel (Backlog: CLI-Overrides für baseUrl/Rollenfilter).

## Empfohlene nächste Schritte
1. BaseURL-Handling im Generator verbessern, damit Skeleton-Tests auch ohne externe Playwright-Konfiguration stabil laufen.
2. Query-Normalisierung/Whitelist in den Crawl-Regeln vorsehen, um langsame oder redundante Seiten zu vermeiden.
3. Optionale Parallelisierung mit Throttling evaluieren, sobald Stabilitätskriterien definiert sind.
4. Leichtgewichtige CLI-Parameter für Base-URL/Rollenfilter ergänzen, um lokale Spikes ohne Config-Änderungen zu ermöglichen.

## Relevante Backlog-Issues
- [DX] BaseURL-Unterstützung in generierten Specs vereinheitlichen
- [Stabilität] Query-Normalisierung & Crawl-Deduplikation erweitern
- [Architektur] Parallelisierung des Crawls mit Ressourcen-Limits
- [DX] CLI-Overrides für baseUrl und Rollenfilter

## Scores
- Codequalität: 7.6/10
- Architektur: 6.6/10
- DX: 7.2/10
- Gesamt: 7.1/10
