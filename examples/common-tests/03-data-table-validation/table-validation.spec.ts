import { test, expect } from '@playwright/test';

/**
 * 🔧 BITTE HIER ANPASSEN UND IN /tests/tables/ ABLEGEN
 */

test.describe('Daten-Tabellen Validierung', () => {
  test('Filter, Suche und Sortierung funktionieren', async ({ page }) => {
    await page.goto('/data-table'); // ⚠️ URL anpassen

    // ⚠️ Selektoren anpassen
    await page.fill('[data-testid="table-search"]', 'Beispiel');
    await page.click('[data-testid="table-filter-active"]');

    const rows = page.locator('[data-testid="table-row"]');
    await expect(rows).toHaveCount(1, { timeout: 5000 }); // ⚠️ Erwartete Mindestanzahl anpassen

    // ⚠️ Sortierung prüfen
    await page.click('[data-testid="table-sort-createdAt"]');
    await page.click('[data-testid="table-sort-createdAt"]'); // Toggle für DESC

    await expect(rows.nth(0)).toContainText('Beispiel');
  });
});
