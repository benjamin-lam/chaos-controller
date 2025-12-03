import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

test.describe('E-Commerce Basisnavigation', () => {
  test('Startseite -> Produktliste -> Produktdetail', async ({ page }) => {
    // ⚠️ BITTE ANPASSEN: Basis-URL auf euren Shop setzen
    await page.goto('/');

    // ⚠️ BITTE ANPASSEN: Selektor für Navigations-CTA
    const productNavLink = page.locator('a[href*="/products"]');
    await expect(productNavLink).toBeVisible();
    await productNavLink.click();
    await expect(page).toHaveURL(/\/products/, { timeout: 15000 });

    // ⚠️ BITTE ANPASSEN: Erwartetes Produkt-Listing validieren
    const firstProductTile = page.locator('.product-tile').first();
    await expect(firstProductTile).toBeVisible();

    // Erstes Produkt öffnen
    await firstProductTile.click();
    await TestUtils.waitForNetworkIdle(page);
    await expect(page).toHaveURL(/products\/./, { timeout: 15000 });

    // ⚠️ BITTE ANPASSEN: Produktdetail-Selektor
    await expect(page.locator('.product-detail')).toBeVisible();

    await page.screenshot({ path: 'test-results/navigation-success.png' });
  });
});
