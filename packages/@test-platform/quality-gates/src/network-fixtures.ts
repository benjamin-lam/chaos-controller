import { test as base, type Page } from '@playwright/test';

/**
 * 🌐 Network-Fixture die Tracking/Ads blockt und optionale Throttling-Konfiguration erlaubt.
 */
export const networkFixtures = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();
      const blockedPatterns = [/google-analytics/, /doubleclick/, /tracking/, /facebook\.com\/tr/];
      if (blockedPatterns.some((pattern) => pattern.test(url))) {
        return route.abort();
      }
      return route.continue();
    });

    if (process.env.NETWORK_THROTTLE) {
      await page.context().setOffline(false);
      // BITTE ANPASSEN: Netzwerkbedingungen für dein Projekt setzen
      console.log(`⏳ NETWORK_THROTTLE aktiv: ${process.env.NETWORK_THROTTLE}`);
    }

    await use(page as Page);
  }
});

export { expect } from '@playwright/test';
