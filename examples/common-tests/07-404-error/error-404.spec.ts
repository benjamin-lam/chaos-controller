import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: 404 prüfen
 * ➜ /tests/system/ ablegen
 */

test('404-Seite wird korrekt angezeigt', async ({ page }) => {
  await page.goto('/non-existing-page-xyz'); // bleibt absichtlich ungültig

  // ⚠️ Selektor für 404-Meldung anpassen
  await expect(page.locator('.error-404')).toBeVisible();
});
