import { test, expect } from '@playwright/test';
import { TestUtils } from '@test-platform/core';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/auth/ ABLEGEN
 * 
 * Dieser Test prüft den Login für Redakteure.
 * ANPASSUNGEN benötigt:
 * 1. Login-URL anpassen
 * 2. Selectors für Login-Formular anpassen
 * 3. Dashboard-Element-Selektor anpassen
 * 4. Evtl. Credentials aus .env Datei laden
 */

test.describe('Login Redakteur Rolle', () => {
  test('Redakteur kann sich einloggen und sieht Dashboard', async ({ page }) => {
    // ⚠️ BITTE ANPASSEN: Setze die korrekte Login-URL
    const LOGIN_URL = '/login'; // Oder vollständige URL
    
    // ⚠️ BITTE ANPASSEN: Credentials aus .env oder Config laden
    const REDAKTEUR_EMAIL = 'redakteur@beispiel.de';
    const REDAKTEUR_PASSWORT = 'geheim123';

    // 1. Navigation zur Login-Seite
    await page.goto(LOGIN_URL);
    
    // 2. Login-Formular ausfüllen
    // ⚠️ BITTE ANPASSEN: Diese Selectors an dein Formular anpassen
    await page.fill('input[type="email"]', REDAKTEUR_EMAIL);
    await page.fill('input[type="password"]', REDAKTEUR_PASSWORT);
    
    // 3. Login-Button klicken
    // ⚠️ BITTE ANPASSEN: Selektor für Login-Button anpassen
    await page.click('button[type="submit"]');
    
    // 4. Warte auf Navigation/Ladung
    await TestUtils.waitForNetworkIdle(page);
    
    // 5. Verifiziere, dass Dashboard sichtbar ist
    // ⚠️ BITTE ANPASSEN: Dieser Selektor muss auf dein Dashboard passen
    const dashboardElement = page.locator('.dashboard-container');
    await expect(dashboardElement).toBeVisible({ timeout: 10000 });
    
    // 6. Optional: Verifiziere spezifische Redakteur-Funktionen
    // ⚠️ BITTE ANPASSEN: Diese Elemente sollten für Redakteure sichtbar sein
    const expectedElements = [
      '.article-editor',
      '.content-overview',
      '.publish-button'
    ];
    
    for (const selector of expectedElements) {
      await expect(page.locator(selector).first()).toBeVisible();
    }
    
    // 📸 Automatischer Screenshot bei Erfolg (optional)
    await page.screenshot({ path: 'test-results/login-redakteur-success.png' });
    
    console.log('✅ Login als Redakteur erfolgreich getestet');
  });

  test('Redakteur sieht keine Admin-Funktionen', async ({ page }) => {
    // Optional: Teste, dass Redakteur keine Admin-Rechte hat
    // ⚠️ BITTE ANPASSEN: Admin-spezifische Elemente definieren
    const adminOnlyElements = [
      '.user-management',
      '.system-settings',
      '.admin-panel'
    ];
    
    for (const selector of adminOnlyElements) {
      await expect(page.locator(selector)).not.toBeVisible();
    }
  });
});
