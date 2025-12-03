# 📰 Template: CMS

Vorkonfiguriertes Setup für Redaktions-Workflows.

## Quickstart
1. Wähle die passende Stage und kopiere `.env.<stage>` aus den Beispielen (`.env.example.development`, `.env.example.staging`, ...).
2. Setze **alle Secrets** (ADMIN/EDITOR/VIEWER Credentials, SENTRY_DSN, ALLOWED_ORIGINS in Prod) via CI/Vault – keine Defaults nutzen.
3. `npm install` ausführen.
4. **BITTE ANPASSEN:** Login-Selectoren via `.env` konfigurieren (EMAIL_SELECTOR, PASSWORD_SELECTOR, SUBMIT_SELECTOR, DASHBOARD_SELECTOR).
5. Tests starten: `npm test` (vollständige Matrix) oder gefiltert `TEST_SUITE=smoke TEST_TAG=@smoke npm test`.

## Features
- 🌐 **Stage-basierte Env-Validation** über `loadEnvForStage` mit verpflichtenden Secrets und klaren Fehlermeldungen.
- 🔐 **Global Setup** erstellt Storage States für Admin/Editor/Viewer – keine Logins pro Testlauf nötig.
- 🧭 **Cross-Browser & Mobile** Projekte inkl. Tag-Governance (@smoke, @regression, @a11y, @mobile).
- 📊 **Reporting**: CI nutzt `ciReporters` (JUnit/JSON/HTML), lokal `localReporters` (Line + HTML mit Auto-Open on failure).

## Enthaltene Beispiele
- `tests/examples/login-redakteur.spec.ts`
- `tests/examples/article-publishing.spec.ts`
