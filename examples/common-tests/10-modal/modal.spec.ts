import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Modal Handling
 * ➜ /tests/ui/modal/ ablegen
 */

test('Modal öffnet und schließt korrekt', async ({ page }) => {
  await page.goto('/');

  await page.click('#open-modal'); // ⚠️ Selektor anpassen
  await expect(page.locator('.modal')).toBeVisible();

  await page.click('.modal .modal-close'); // ⚠️ Selektor prüfen
  await expect(page.locator('.modal')).toBeHidden();
});
