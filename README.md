# 🚀 Playwright Test Platform

## 📖 ÜBERSICHT
Geteilte Infrastruktur für Playwright Tests mit projekt-spezifischen Implementationen.

## 🏗️ ARCHITEKTUR
```
Shared Infrastructure (30%)          Custom Tests (70%)
├── Test Runner Config              ├── Page Objects
├── CI/CD Pipelines                ├── Test Cases
├── Utility Functions              ├── Selectors
├── Reporting Setup                ├── Business Logic
└── Quality Gates                  └── Test Data
```

## 🚀 SCHNELLSTART

### 1. Neue Test-Suite erstellen
```bash
# CMS Projekt
npx ./bootstrap/create-test-suite --template=cms --name=mein-cms

# E-Commerce Projekt
npx ./bootstrap/create-test-suite --template=ecommerce --name=mein-shop
```

### 2. Tests anpassen
1. Gehe zu `/tests/examples/`
2. Kopiere benötigte Tests
3. Passe Selectors und URLs an
4. Lege in `/tests/` ab

### 3. Tests ausführen
```bash
cd mein-cms
npm install
npm test
```

## 📚 BEISPIELE NUTZEN

Die Beispiele unter `/examples/` sind als Kopiervorlagen gedacht:

1. **Login Tests** (`01-login-redakteur/`) - Für Authentifizierung
2. **Dashboard Tests** (`02-dashboard-verification/`) - Für Startseiten
3. **Table Tests** (`03-data-table-validation/`) - Für Daten-Tabellen
4. **Form Tests** (`04-form-submission/`) - Für Formulare

## 🔧 ANPASSUNGEN

### Für jedes neue Projekt:
1. `playwright.config.ts` - Basis-URL anpassen
2. `.env` Datei - Environment Variables setzen
3. `tests/` Ordner - Eigene Tests schreiben

## 🌱 Environment & Laufzeit-Flags

- Stage-spezifische Konfiguration: Lege `.env.<stage>` Dateien auf Basis der entsprechenden `.env.example.<stage>` an; der `env-loader` validiert Pflichtfelder pro Stage.
- `HEADLESS` steuert, ob Playwright im sichtbaren Modus läuft (`false` zum Debuggen).
- `TEST_SUITE` bestimmt die Project-Matrix (`smoke`, `regression`, `a11y`), `TEST_TAG` kann Tests per RegExp filtern.
- `ENABLE_SCREENSHOTS` und `ENABLE_TRACES` aktivieren zusätzliche Artefakte; die Config setzt sie automatisch auf sinnvolle Defaults für Fehlersuche.

### Shared Packages nutzen:
```typescript
import { TestUtils } from '@test-platform/core';

// In deinen Tests
await TestUtils.waitForNetworkIdle(page);
await TestUtils.takeScreenshotOnFailure(testInfo);
```

## 📁 ORDNERSTRUKTUR EINES PROJEKTS
```
mein-projekt/
├── tests/                    # HIER EIGENE TESTS ABLEGEN
│   ├── auth/                # Login/Logout Tests
│   ├── dashboard/           # Dashboard Tests
│   ├── content/             # Inhalts-Tests
│   └── api/                 # API Tests
├── pages/                   # Page Objects
├── fixtures/                # Custom Fixtures
├── utils/                   # Projekt-spezifische Utilities
└── test-results/            # Automatisch generiert
```

## 🎯 BEST PRACTICES

1. **Selectors**: Daten-Attribute nutzen (`data-testid`)
2. **Credentials**: Nie im Code, immer in `.env`
3. **Page Objects**: Pro Seite eine Klasse
4. **Tests isolieren**: Jeder Test unabhängig
5. **Reporting**: Traces für Debugging aktivieren

## 🤖 Auto-Pilot Prompt

Nutze die Vorlage unter [`docs/playwright-auto-pilot.md`](docs/playwright-auto-pilot.md), um automatisierte Playwright Code-Reviews mit klaren Auto-Fixes, Vorschlägen und Human-in-the-Loop Hinweisen auszulösen.
