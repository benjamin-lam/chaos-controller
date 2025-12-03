# @test-platform/core

Gemeinsame Utilities und Konfigurationsvorlagen für alle Playwright-Projekte.

## Inhalt
- Netzwerk-, Retry- und Screenshot-Helper
- Konfigurations-Presets für Playwright
- Env-Validator inkl. Login-Selector-Defaults und Storage-State-Pfade
- Geräte-/Projekt-Matrizen (Smoke, Full, A11y)
- Global Setup für rollenbasierte Storage States
- Keine Business-Logik, keine Page Objects

## Nutzung
```ts
import { TestUtils, ciConfig, loadAndValidateEnv, deviceMatrix } from '@test-platform/core';
```

### Wichtige Hinweise
- **BITTE ANPASSEN**: Timeout-Werte in `config-presets.ts` falls eure Pipelines langsamer/schneller sind.
- **BITTE ANPASSEN**: Nutzung von `ScreenshotUtils.capture` nach eurem Namensschema.
- **BITTE ANPASSEN**: `NetworkUtils.waitForNetworkIdle` ggf. auf `domcontentloaded` ändern, falls eure App Streaming nutzt.
- **BITTE ANPASSEN**: Env-Variablen in `.env` setzen (BASE_URL, Credentials, Selektoren); `loadAndValidateEnv` bricht bei Fehlern ab.
- **BITTE ANPASSEN**: `deviceMatrix`/`smokeMatrix` können bei Bedarf reduziert werden, wenn Laufzeiten zu lang sind.
- **BITTE ANPASSEN**: Global Setup nutzt Standard-Selektoren (`EMAIL_SELECTOR`, `PASSWORD_SELECTOR`, `SUBMIT_SELECTOR`), diese sollten projektspezifisch überschrieben werden.
