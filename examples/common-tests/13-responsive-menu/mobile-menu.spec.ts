import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Responsive Navigation
 * ➜ /tests/responsive/ ablegen
 */

test('Mobile Menü erscheint im Smartphone-Viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('/');

  await page.click('#menu-toggle'); // ⚠️ Selektor anpassen
  await expect(page.locator('#mobile-nav')).toBeVisible();
});
