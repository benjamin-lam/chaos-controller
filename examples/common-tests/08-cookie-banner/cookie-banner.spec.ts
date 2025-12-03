import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Cookie Banner
 * ➜ /tests/privacy/ ablegen
 */

test('Cookie Banner erscheint und speichert Auswahl', async ({ page }) => {
  await page.goto('/');

  const banner = page.locator('#cookie-banner'); // ⚠️ Selektor prüfen
  await expect(banner).toBeVisible();

  await banner.getByRole('button', { name: /akzeptieren/i }).click();

  const cookies = await page.context().cookies();
  expect(cookies.some((c) => c.name === 'cookie_consent')).toBeTruthy();
});
