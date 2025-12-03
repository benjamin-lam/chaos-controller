import { test, expect } from '@playwright/test';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/forms/ ABLEGEN
 */

test.describe('Formular Submission', () => {
  test('Pflichtfelder und Erfolgsmeldung', async ({ page }) => {
    await page.goto('/form'); // ⚠️ URL anpassen

    // ⚠️ Selektoren und Testdaten anpassen
    await page.fill('[name="firstName"]', 'Max');
    await page.fill('[name="lastName"]', 'Mustermann');
    await page.fill('[name="email"]', 'max@example.com');

    await page.click('button[type="submit"]');

    // ⚠️ Selektor für Erfolgsmeldung anpassen
    await expect(page.locator('.alert-success')).toBeVisible();
  });
});
