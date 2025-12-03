# 🛍️ Template: E-Commerce

Vorkonfiguriertes Setup für Shop-Workflows.

## Quickstart
1. Wähle die Stage und kopiere `.env.<stage>` aus den Beispielen; setze Secrets in CI/Vault.
2. `npm install`
3. **BITTE ANPASSEN:** Selektoren/URLs in `.env` und Tests.
4. Tests: `npm test` oder gefiltert `TEST_SUITE=smoke TEST_TAG=@smoke npm test`.

## Features
- Stage-basierte Env-Validation mit verpflichtenden Secrets.
- Global Setup erzeugt Storage States für Admin/Merchant/Viewer.
- Cross-Browser-/Mobile-Matrix mit Tags (@smoke, @regression, @a11y, @mobile).
- CI-Reporter (JUnit/JSON/HTML) und lokale Reporter mit HTML-Open-on-failure.
