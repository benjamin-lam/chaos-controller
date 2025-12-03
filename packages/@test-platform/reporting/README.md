# @test-platform/reporting

Reporter-Bibliothek für die Test Platform. Enthält HTML- und JUnit-Beispiele sowie vorkonfigurierte Reporter-Profile für CI & lokal.

## Nutzung in playwright.config.ts
```ts
import { HtmlReporter, JunitReporter, ciReporters, localReporters } from '@test-platform/reporting';

export default defineConfig({
  reporter: process.env.CI ? ciReporters : localReporters
});
```

> ⚠️ **BITTE ANPASSEN:** Passe die Ausgabepfade an eure CI-Artefakte an.
