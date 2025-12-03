import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';
import { env } from '../../config/env';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/auth/ ABLEGEN
 */

test.describe('Login Redakteur Rolle', () => {
  test('Redakteur kann sich einloggen und sieht Dashboard', async ({ page }) => {
    const REDAKTEUR_EMAIL = process.env.REDAKTEUR_EMAIL || 'redakteur@beispiel.de';
    const REDAKTEUR_PASSWORT = process.env.REDAKTEUR_PASSWORT || 'geheim123';
    const navigationTimeout = env.NAVIGATION_TIMEOUT ?? 10000;

    await page.goto(env.LOGIN_PATH);
    const emailField = page.locator(env.EMAIL_SELECTOR);
    const passwordField = page.locator(env.PASSWORD_SELECTOR);
    const submitButton = page.locator(env.SUBMIT_SELECTOR);

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();

    await emailField.fill(REDAKTEUR_EMAIL);
    await passwordField.fill(REDAKTEUR_PASSWORT);
    await submitButton.click();

    await TestUtils.waitForNetworkIdle(page, navigationTimeout);
    await expect(page).toHaveURL(new RegExp(env.DASHBOARD_PATH_MATCHER), { timeout: navigationTimeout });
    await expect(page.locator(env.DASHBOARD_SELECTOR)).toBeVisible({ timeout: navigationTimeout });
  });
});
