import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * 🔧 BEISPIEL: Accessibility Test
 * ➜ /tests/a11y/ ablegen
 */

test('Homepage hat keine schwerwiegenden A11y-Fehler', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.length).toBe(0);
});
