import { test, expect } from '@playwright/test';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/dashboard/ ABLEGEN
 * 
 * Prüft, ob das Dashboard korrekt geladen wird.
 * ANPASSUNGEN benötigt:
 * 1. Dashboard-URL anpassen
 * 2. Erwartete Widgets/Sektionen definieren
 */

test.describe('Dashboard Verifikation', () => {
  test('Dashboard lädt alle Widgets', async ({ page }) => {
    // ⚠️ BITTE ANPASSEN: Dashboard-URL
    await page.goto('/dashboard');
    
    // ⚠️ BITTE ANPASSEN: Diese Widgets sollten auf deinem Dashboard existieren
    const expectedWidgets = [
      '.stats-overview',
      '.recent-activity',
      '.quick-actions',
      '.notifications'
    ];
    
    for (const widget of expectedWidgets) {
      await expect(page.locator(widget)).toBeVisible({ timeout: 5000 });
    }
  });
});
