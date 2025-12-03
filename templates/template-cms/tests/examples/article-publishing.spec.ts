import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/content/ ABLEGEN
 */

test.describe('Artikel Veröffentlichung', () => {
  test('Redakteur kann neuen Artikel veröffentlichen', async ({ page }) => {
    // ⚠️ URL und Selektoren anpassen
    await page.goto('/articles/new');

    const titleField = page.locator('input[name="title"]');
    const bodyField = page.locator('textarea[name="body"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(titleField).toBeVisible();
    await expect(bodyField).toBeVisible();

    await titleField.fill('Playwright Platform Beispiel');
    await bodyField.fill('Dies ist ein Beispielartikel.');
    await submitButton.click();

    await TestUtils.waitForNetworkIdle(page);
    await expect(page.locator('.article-status', { hasText: 'veröffentlicht' })).toBeVisible();
  });
});
