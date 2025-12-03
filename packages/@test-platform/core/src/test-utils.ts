import { Page, TestInfo } from '@playwright/test';

export class TestUtils {
  /**
   * 📝 NUTZE DIESE HELPER IN DEINEN EIGENEN TESTS
   * Diese Funktion wartet bis alle Netzwerk-Requests abgeschlossen sind.
   * Beispiel:
   * ```ts
   * await TestUtils.waitForNetworkIdle(page, 8000);
   * ```
   */
  static async waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * 📝 AUTOMATISCHE SCREENSHOTS BEI FEHLERN
   * Füge diese in deine Tests ein: await TestUtils.takeScreenshotOnFailure(testInfo);
   * Falls du eine eigene Page-Instanz übergibst, wird diese genutzt.
   */
  static async takeScreenshotOnFailure(testInfo: TestInfo, pageOverride?: Page): Promise<void> {
    if (testInfo.status !== 'passed') {
      const page = pageOverride ?? (testInfo as unknown as { page?: Page }).page;
      if (!page) return;
      await testInfo.attach('screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    }
  }
}
