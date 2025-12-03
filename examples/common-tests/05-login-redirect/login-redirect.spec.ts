import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Login mit Weiterleitung prüfen
 * ➜ In /tests/auth/ ablegen und Selektoren/URLs anpassen
 */

test('Login funktioniert und Dashboard lädt', async ({ page }) => {
  // ⚠️ URL prüfen
  await page.goto('/login.php?redirect=/dashboard.php');

  // ⚠️ Selektoren/Credentials anpassen
  await page.fill('#username', 'editor');
  await page.fill('#password', 'editor123');

  await page.click('button[type="submit"]');

  // ⚠️ Erfolgskriterium anpassen
  await expect(page).toHaveURL(/\/dashboard\.php$/);
  await expect(page.getByTestId('dashboard-title')).toBeVisible();
});
