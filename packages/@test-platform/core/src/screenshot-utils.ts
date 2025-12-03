import { Page, TestInfo } from '@playwright/test';

/**
 * 📸 Screenshot-Utilities, die für schnelle Debugging-Läufe gedacht sind.
 */
export class ScreenshotUtils {
  /**
   * Macht einen beschrifteten Screenshot in den test-results Ordner.
   */
  static async capture(page: Page, name: string) {
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }

  /**
   * Hilfsfunktion für Debug-Screenshots innerhalb von Test-Schritten.
   */
  static async captureStep(testInfo: TestInfo, page: Page, stepName: string) {
    await testInfo.attach(`step-${stepName}`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });
  }
}
