import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

test.describe('E-Commerce Basisnavigation', () => {
  test('Startseite -> Produktliste -> Produktdetail', async ({ page }) => {
    // ⚠️ BITTE ANPASSEN: Basis-URL auf euren Shop setzen
    await page.goto('/');

    // ⚠️ BITTE ANPASSEN: Selektor für Navigations-CTA
    await page.click('a[href*="/products"]');
    await TestUtils.waitForNetworkIdle(page);

    // ⚠️ BITTE ANPASSEN: Erwartetes Produkt-Listing validieren
    await expect(page.locator('.product-tile').first()).toBeVisible();

    // Erstes Produkt öffnen
    await page.locator('.product-tile').first().click();
    await TestUtils.waitForNetworkIdle(page);

    // ⚠️ BITTE ANPASSEN: Produktdetail-Selektor
    await expect(page.locator('.product-detail')).toBeVisible();

    await page.screenshot({ path: 'test-results/navigation-success.png' });
  });
});
