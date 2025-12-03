import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Formular Validierung
 * ➜ /tests/forms/ ablegen
 */

test('Formular zeigt Client- und Server-Fehler an', async ({ page }) => {
  await page.goto('/forms/registration.php');

  await page.click('button[type="submit"]'); // leer submitten

  await expect(page.locator('[data-testid="registration-email-error"]')).toBeVisible(); // ⚠️ Selektoren prüfen

  await page.fill('#registration-email', 'invalid@example');
  await page.click('button[type="submit"]');

  await expect(page.locator('[data-testid="registration-email-error"]')).toContainText(/invalid|ungültig/i);
});
