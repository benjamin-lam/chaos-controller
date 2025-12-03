import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/content/ ABLEGEN
 */

test.describe('Artikel Veröffentlichung', () => {
  test('Redakteur kann neuen Artikel veröffentlichen', async ({ page }) => {
    // ⚠️ URL und Selektoren anpassen
    await page.goto('/articles/new');

    await page.fill('input[name="title"]', 'Playwright Platform Beispiel');
    await page.fill('textarea[name="body"]', 'Dies ist ein Beispielartikel.');
    await page.click('button[type="submit"]');

    await TestUtils.waitForNetworkIdle(page);
    await expect(page.locator('.article-status', { hasText: 'veröffentlicht' })).toBeVisible();
  });
});
