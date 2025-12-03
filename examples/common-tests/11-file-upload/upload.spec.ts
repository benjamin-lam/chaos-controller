import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: File Upload
 * ➜ /tests/forms/upload/ ablegen
 */

test('Upload: Fehler bei falschem Dateityp', async ({ page }) => {
  await page.goto('/forms/upload.php');

  await page.setInputFiles('input[type="file"]', 'examples/php-test-server/tests/assets/dummy.txt'); // ⚠️ Pfad prüfen

  await expect(page.locator('.fileuploaderror')).toBeVisible(); // ⚠️ Selektor prüfen
});

test('Upload: Erfolgreicher Durchlauf', async ({ page }) => {
  await page.goto('/forms/upload.php');

  await page.setInputFiles('input[type="file"]', 'examples/php-test-server/tests/assets/image.txt');

  await expect(page.locator('.upload-progress')).toBeVisible(); // ⚠️ Selektor prüfen
});
