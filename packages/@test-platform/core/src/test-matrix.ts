import { devices, type PlaywrightTestConfig } from '@playwright/test';

export const TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  A11Y: '@a11y',
  PERFORMANCE: '@performance',
  API: '@api',
  VISUAL: '@visual'
} as const;

export const TestMatrix: Record<string, PlaywrightTestConfig['projects'] | PlaywrightTestConfig['projects'][number]> = {
  smoke: {
    name: 'smoke-chromium',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    testMatch: '**/*.spec.ts',
    grep: TAGS.SMOKE,
    timeout: 30_000,
    retries: 1
  },
  regression: [
    {
      name: 'regression-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.spec.ts',
      grep: TAGS.REGRESSION,
      timeout: 60_000,
      retries: 2
    },
    {
      name: 'regression-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/*.spec.ts',
      grep: TAGS.REGRESSION,
      timeout: 60_000,
      retries: 2
    }
  ],
  a11y: {
    name: 'accessibility',
    use: { ...devices['Desktop Chrome'] },
    testMatch: '**/a11y/**',
    grep: TAGS.A11Y,
    timeout: 45_000,
    retries: 0
  },
  mobile: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/*.spec.ts',
      grep: /@mobile|@responsive/
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/*.spec.ts',
      grep: /@mobile|@responsive/
    }
  ]
};

export const CLIPresets = {
  smoke: `npx playwright test --grep "${TAGS.SMOKE}" --project="smoke-chromium"`,
  regression: 'npx playwright test --grep "@regression"',
  a11y: 'npx playwright test --grep "@a11y" --project="accessibility"',
  mobile: 'npx playwright test --grep "@mobile" --project="mobile-chrome"',
  all: 'npx playwright test --reporter=html,junit --timeout=60000'
};

export class ReportUploader {
  static uploadHelp(ciPlatform: 'github' | 'gitlab' | 'jenkins') {
    switch (ciPlatform) {
      case 'github':
        console.log('::set-output name=reports-dir::test-results');
        break;
      case 'gitlab':
        console.log('GitLab Artifacts: test-results/* bitte als Artefakt konfigurieren.');
        break;
      case 'jenkins':
        console.log('JUnit Results unter test-results/junit/results.xml für Jenkins bereitstellen.');
        break;
      default:
        console.log('CI-Plattform nicht erkannt. Stelle sicher, dass test-results als Artefakt hochgeladen wird.');
    }
  }
}
