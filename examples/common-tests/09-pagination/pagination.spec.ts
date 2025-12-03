import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Pagination
 * ➜ /tests/ui/table/ ablegen
 */

test('Pagination funktioniert', async ({ page }) => {
  await page.goto('/products.php'); // ⚠️ URL anpassen

  await page.click('.pagination >> text="2"'); // ⚠️ Selektor prüfen
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('[data-testid="product-list"] .product-item').first()).toBeVisible();
});
