import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Persistente Session
 * ➜ /tests/auth/ ablegen
 */

test('Session bleibt nach Reload erhalten', async ({ page }) => {
  await page.goto('/login.php?redirect=/dashboard.php');

  // ⚠️ Fake Credentials
  await page.fill('#username', 'viewer');
  await page.fill('#password', 'viewer123');
  await page.click('button[type="submit"]');

  await page.reload();
  await expect(page).toHaveURL(/dashboard\.php/); // ⚠️ Dashboard prüfen
  await expect(page.getByTestId('dashboard-title')).toBeVisible();
});
