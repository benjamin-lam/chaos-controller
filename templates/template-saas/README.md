# ☁️ Template: SaaS

Vorkonfiguriertes Setup für mandantenfähige SaaS-Workflows.

## Quickstart
1. Stage auswählen und passende `.env.<stage>`-Datei anlegen (auf Basis der Beispiele).
2. Secrets in CI/Vault hinterlegen (keine Defaults in Prod).
3. `npm install`
4. Tests: `npm test` oder gezielt `TEST_SUITE=smoke TEST_TAG=@smoke npm test`.

## Features
- Stage-basierte Env-Validation mit verpflichtenden Credentials.
- Global Setup erstellt Storage States für Admin/Editor/Viewer.
- Tag-basierte Projekte für Smoke/Regression/A11y + Mobile-Devices.
- CI-Reporter (JUnit/JSON/HTML) und lokale HTML-Ausgabe bei Fehlern.
