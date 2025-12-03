import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Suche
 * ➜ /tests/search/ ablegen
 */

test('Suche liefert Ergebnisse', async ({ page }) => {
  await page.goto('/');

  await page.fill('#search', 'Pizza'); // ⚠️ Suchfeld anpassen
  await page.press('#search', 'Enter');

  const results = page.locator('.search-results li');
  await expect(results).not.toHaveCount(0); // ⚠️ Prüfmuster anpassen
});
