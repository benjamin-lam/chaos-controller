# @test-platform/quality-gates

Qualitäts-Gates, Netz-Fixtures und CI-Empfehlungen für die Playwright Test Platform.

## Nutzung
```ts
import { networkFixtures } from '@test-platform/quality-gates';
// test = networkFixtures; // um Tracking-Dienste zu blocken
```

## Scripts
- `npm run lint` – ESLint mit Basisregeln
- `npm run typecheck` – TypeScript Strict Check
- `npm run test:stability` – Wiederholter Lauf für Stabilitätsmessung
- `npm run test:flaky` – Höhere Retry-Policy für flaky gekennzeichnete Tests

## Konfiguration
- `src/lint-configs/eslint.config.js` als Startpunkt für Projekte
- `src/lint-configs/tsconfig.strict.json` für strikte Typisierung

BITTE ANPASSEN: Passe Regeln, Netz-Blocking und Throttling an eure Umgebung an.
