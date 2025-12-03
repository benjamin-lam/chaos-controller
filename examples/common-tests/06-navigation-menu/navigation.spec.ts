import { test, expect } from '@playwright/test';

/**
 * 🔧 BEISPIEL: Navigation validieren
 * ➜ /tests/ui/header/ ablegen
 */

test('Navigation: Alle Hauptlinks erreichbar', async ({ page }) => {
  await page.goto('/');

  const links = [
    { label: 'Home', url: '/' },
    { label: 'Shop', url: '/shop.php' },
    { label: 'Kontakt', url: '/contact.php' },
  ]; // ⚠️ Menüpunkte anpassen

  for (const { label, url } of links) {
    await page.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(url);
  }
});
