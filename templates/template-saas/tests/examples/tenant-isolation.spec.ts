import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

test.describe('Mandanten-Isolation', () => {
  test('Nutzer sieht nur Daten seines Mandanten', async ({ page }) => {
    // ⚠️ BITTE ANPASSEN: Login-Fluss für eure SaaS
    await page.goto('/login');
    const emailInput = page.locator('[name="email"]');
    const passwordInput = page.locator('[name="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    await emailInput.fill(process.env.SAAS_EMAIL || 'tenant@test.de');
    await passwordInput.fill(process.env.SAAS_PASS || 'geheim');
    await submitButton.click();

    await TestUtils.waitForNetworkIdle(page);
    await page.goto('/tenant/dashboard');

    // ⚠️ BITTE ANPASSEN: Selektor für Tenant-Label
    await expect(page.locator('[data-testid="tenant-name"]')).toContainText('Tenant A');

    // ⚠️ BITTE ANPASSEN: Prüfen, dass keine fremden Datensätze sichtbar sind
    await expect(page.locator('.foreign-tenant-row')).toHaveCount(0);
  });
});
