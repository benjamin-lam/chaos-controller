import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/auth/ ABLEGEN
 */

test.describe('Login Redakteur Rolle', () => {
  test('Redakteur kann sich einloggen und sieht Dashboard', async ({ page }) => {
    const LOGIN_URL = '/login'; // ⚠️ Login-URL anpassen
    const REDAKTEUR_EMAIL = process.env.REDAKTEUR_EMAIL || 'redakteur@beispiel.de';
    const REDAKTEUR_PASSWORT = process.env.REDAKTEUR_PASSWORT || 'geheim123';

    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"]', REDAKTEUR_EMAIL);
    await page.fill('input[type="password"]', REDAKTEUR_PASSWORT);
    await page.click('button[type="submit"]');

    await TestUtils.waitForNetworkIdle(page);
    await expect(page.locator('.dashboard-container')).toBeVisible({ timeout: 10000 });
  });
});
