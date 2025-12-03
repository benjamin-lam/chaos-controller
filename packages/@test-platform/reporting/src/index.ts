import type { ReporterDescription } from '@playwright/test';

export * from './html-reporter';
export * from './junit-reporter';

/**
 * 📦 Vorkonfigurierte Reporter-Profile für lokale Entwicklung und CI.
 * Einfach in der playwright.config.ts nutzen:
 * reporter: process.env.CI ? ciReporters : localReporters
 */
export const ciReporters: ReporterDescription[] = [
  ['html', { outputFolder: 'test-results/html', open: 'never' }],
  ['junit', { outputFile: 'test-results/junit/results.xml' }],
  ['json', { outputFile: 'test-results/json/results.json' }]
];

export const localReporters: ReporterDescription[] = [
  ['line'],
  ['html', { outputFolder: 'test-results/html', open: 'on-failure' }]
];
