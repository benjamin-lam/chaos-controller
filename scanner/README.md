# Site Scanner (Playwright-basiert)

Dieser Ordner enthält einen **konfigurierbaren Site-Scanner**, der mit Hilfe von Playwright:

- deine Anwendung mit verschiedenen **Rollen** (public, customer, admin, …) crawlt  
- pro Seite **strukturelle Komponenten** erkennt (Header, Footer, Navigation, Login, Formulare, Tabellen, Hero, Slider etc.)  
- einen **JSON-Report** (maschinenlesbar) und einen **Markdown-Report** (menschlich lesbar) erzeugt  

Ziel: Eine **Test-Landkarte** deiner Anwendung, auf deren Basis du Playwright-Tests planen und generieren kannst.

---

## 1. Voraussetzungen

- Node.js installiert
- Playwright ist im Projekt installiert  
  (z. B. über `@playwright/test`, wie in den bestehenden Tests)
- TypeScript-Setup vorhanden, z. B.:
  - `ts-node`
  - oder `tsx`
  - oder Build via `tsc` + `node`

> **Hinweis:** In `site-scanner.ts` wird aktuell `@playwright/test` verwendet (`import { chromium } from '@playwright/test'`).  
> Falls du lieber das `playwright`-Paket verwenden möchtest, kannst du den Import leicht anpassen.

---

## 2. Struktur

```text
/scanner
  ├─ crawler.config.ts   # Typdefinitionen
  ├─ scanner.config.ts   # Projektkonfiguration (Rollen, Vokabular, Base URL)
  ├─ site-scanner.ts     # Scanner-Logik
  ├─ generate-tests-from-report.ts # Test-Skeleton-Generator
  └─ README.md           # Diese Datei
```

---

## 3. Konfiguration anpassen (`scanner.config.ts`)

Die Datei `scanner.config.ts` ist dein zentrales Steuerzentrum.

### 3.1 Base URL

```
baseUrl: 'http://localhost:8080', // ⚠️ anpassen
```

Stelle sicher, dass diese URL deine Anwendung erreichbar macht (dev, staging oder local).

### 3.2 Rollen (public, customer, admin …)

Jede Rolle wird als `RoleConfig` definiert:

```
{
  name: 'customer',
  type: 'login',
  storageStateFile: 'storage/customer.json',
  login: {
    loginPath: '/login',
    credentials: {
      EMAIL: 'customer@example.com',
      PASSWORD: 'secret',
    },
    steps: [
      { action: 'goto', url: '/login' },
      { action: 'fill', selector: '#email', valueKey: 'EMAIL' },
      { action: 'fill', selector: '#password', valueKey: 'PASSWORD' },
      { action: 'click', selector: 'button[type="submit"]' },
      { action: 'waitForURL', pattern: '/dashboard' },
    ],
  },
  crawl: {
    startPaths: ['/dashboard', '/account'],
    includePatterns: [/^\/(dashboard|account)(\/.*)?$/],
    excludePatterns: [/\/logout\b/],
    maxPages: 100,
    maxDepth: 4,
  },
}
```

- `type`: `'public' | 'login'`
- `storageStateFile` (optional): Wenn vorhanden, wird dieser Playwright Storage State verwendet.
- `login`: Bestimmt, wie sich die Rolle einloggt (nur nötig, wenn kein Storage State genutzt wird)
  - `crawl`:
    - `startPaths`: Startpunkte des Crawls (relativ zur Base URL)
      - Leere oder doppelte Einträge werden beim Start dedupliziert.
    - `includePatterns`: Welche Pfade in den Crawl einbezogen werden
    - `excludePatterns`: Welche Pfade ausgeschlossen werden
    - `maxPages`: Harte Obergrenze der Seiten pro Rolle
  - `maxDepth`: Maximale Klicktiefe (0 = Startseiten)

### 3.3 Projekt-Vokabular (`vocabulary`)

Hier hinterlegst du, wie der Scanner deine Komponenten erkennt:

```
vocabulary: {
  components: [
    {
      name: 'header',
      selectors: ['header', '[role="banner"]'],
    },
    {
      name: 'footer',
      selectors: ['footer', '[role="contentinfo"]'],
    },
    {
      name: 'navigation',
      selectors: ['nav', '[role="navigation"]', '.main-nav'],
    },
    {
      name: 'hero',
      selectors: ['.hero', '.hero-banner', '.hero-section', '.masthead'],
      classNameRegex: /hero/i,
      special: 'hero',
    },
    {
      name: 'slider',
      selectors: ['.slider', '.carousel', '.swiper'],
      classNameRegex: /(slider|carousel|swiper)/i,
      special: 'slider',
    },
    {
      name: 'login',
      selectors: ['form[action*="login"]'],
      special: 'login',
    },
    {
      name: 'table',
      selectors: ['table', '[role="table"]'],
    },
    {
      name: 'form',
      selectors: ['form'],
    },
    // ⚠️ Eigene Komponenten hier ergänzen:
    // { name: 'product-card', classNameRegex: /product-card/i },
  ],
}
```

- `selectors`: klassische CSS-Selektoren
- `classNameRegex`: Regex, der auf `className` angewandt wird
- `special`: `'login' | 'hero' | 'slider' | 'custom'`:
  - z. B. `login` prüft zusätzlich auf Passwort-Felder und Login-Texte

---

## 4. Scanner ausführen

### 4.1 Direkt mit ts-node / tsx

Beispiel:

```
npx ts-node scanner/site-scanner.ts
# oder
npx tsx scanner/site-scanner.ts
```

### 4.2 Optionales NPM-Script (Beispiel)

In deiner `package.json` könntest du z. B. ergänzen:

```
{
  "scripts": {
    "scan:site": "ts-node scanner/site-scanner.ts"
  }
}
```

> Hinweis: Der Scanner selbst ändert keinen Code. Er liest nur HTML-Struktur und schreibt Reports.

### 4.3 Beispiel: PHP-Testserver unter `/examples/php-test-server`

Der aktuelle `scanner.config.ts` ist für den mitgelieferten PHP-Testserver vorkonfiguriert.

1. **Server starten** (separates Terminal):

   ```bash
   cd examples/php-test-server
   php -S 0.0.0.0:8080 router.php
   ```

2. **Scanner ausführen** (benötigt `ts-node` und `@playwright/test`, z. B. per `npx`):

   ```bash
   npx --yes --package ts-node --package @playwright/test ts-node scanner/site-scanner.ts
   ```

3. **Tests aus Report generieren** (nach erfolgreichem Scan):

   ```bash
   npx --yes --package ts-node --package @playwright/test ts-node scanner/generate-tests-from-report.ts
   ```

> Tipp: Wenn du eigene Pakete nutzt, passe die Befehle entsprechend an (z. B. `pnpm dlx` oder ein lokales TS-Setup).

---

## 5. Ausgabe

Standardmäßig werden Reports unter `scanner-output/` erzeugt:

```
/scanner-output
  ├─ site-report.json
  └─ site-report.md
```

### 5.1 site-report.json

Maschinenlesbare Rohdaten, z. B.:

```
{
  "config": { "baseUrl": "http://localhost:8080", "roles": [/* … */] },
  "generatedAt": "2025-12-03T18:42:00.000Z",
  "pages": [
    {
      "role": "public",
      "url": "http://localhost:8080/",
      "title": "Startseite",
      "status": 200,
      "depth": 0,
      "components": {
        "header": 1,
        "footer": 1,
        "navigation": 1,
        "hero": 1,
        "slider": 1,
        "form": 0,
        "login": 0
      }
    }
  ]
}
```

### 5.2 site-report.md

Lesbarer Bericht, sortiert nach Rollen und Seiten, z. B.:

```
# Site Scan Report

Generiert am: 2025-12-03T18:42:00.000Z

Base URL: http://localhost:8080

## Rolle: public

Gesamt Seiten: 3

### http://localhost:8080/

- Titel: Startseite
- Status: 200
- Tiefe: 0

**Komponenten:**

- header: 1
- footer: 1
- navigation: 1
- hero: 1
- slider: 1
- form: 0
- login: 0
```

---

## 6. Typische Anpassungen

- Neue Rolle hinzufügen:
  - z. B. `moderator`, mit eigenen Login-Steps und `crawl.startPaths`.
- Weitere Komponenten:
  - Produkt-Detailseiten (`.product-detail`)
  - Checkout Schritte (`.checkout-step`)
  - Spezielle Teaser/Widgets.
- Crawl-Beschränkung:
  - `maxPages` / `maxDepth` erhöhen oder verringern, je nach Projektgröße.
- Performance / Höflichkeit:
  - `requestDelayMs` in `scanner.config.ts` anpassen (oder auf 0 setzen).

---

## 7. Fehlermodell

Fehler bei `goto` oder Analyse werden:

- im Terminal geloggt (`console.error` / `console.warn`)
- zusätzlich als `error`-Feld in `PageComponentSummary` gespeichert

Der Scanner bricht nicht komplett ab, sondern versucht, weiterzumachen („best effort“).

---

## 8. Tests aus Report generieren

1. **Scanner laufen lassen** (falls noch nicht geschehen):

   ```
   npx ts-node scanner/site-scanner.ts
   # oder tsx / Build+node – je nach Setup
   ```

   Dadurch entsteht `scanner-output/site-report.json`.

2. **Generator ausführen**:

   ```
   npx ts-node scanner/generate-tests-from-report.ts
   ```

   Ergebnis: Ordner `tests/generated/` mit pro Rolle+Seite einer Datei, z. B.:

   ```
   public--.spec.ts
   customer-dashboard.spec.ts
   admin-admin-users.spec.ts
   ```

3. **Manuell verfeinern**:

   - ⚠️ Selektoren anpassen
   - Business-Logik ergänzen
   - Redundante Tests ggf. löschen oder zusammenführen

