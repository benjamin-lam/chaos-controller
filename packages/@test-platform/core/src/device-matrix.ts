import { devices, type PlaywrightTestConfig } from '@playwright/test';

/**
 * 📱 Standardisierte Geräte-/Browser-Matrix für konsistente Regressionen.
 * Kann direkt in playwright.config.ts genutzt werden.
 */
export const deviceMatrix: PlaywrightTestConfig['projects'] = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } }
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } }
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'], viewport: { width: 1920, height: 1080 } }
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 7'] }
  },
  {
    name: 'mobile-safari',
    use: { ...devices['iPhone 13'] }
  },
  {
    name: 'tablet',
    use: { ...devices['iPad Pro 11'] }
  }
];

/**
 * 🚀 Schlanke Smoke-Matrix mit Tag-Filter, um schnelle Gates laufen zu lassen.
 * Nutze TEST_TYPE=smoke, um nur diese Projekte zu aktivieren.
 */
export const smokeMatrix: PlaywrightTestConfig['projects'] = [
  {
    name: 'smoke-chromium',
    testMatch: '**/*.spec.ts',
    grep: /@smoke/,
    use: { ...devices['Desktop Chrome'] }
  }
];

/**
 * ♿ A11y-spezifische Matrix; Tests unter /a11y/ werden hier priorisiert.
 */
export const a11yMatrix: PlaywrightTestConfig['projects'] = [
  {
    name: 'a11y-chromium',
    testMatch: '**/a11y/**',
    use: { ...devices['Desktop Chrome'] }
  }
];
