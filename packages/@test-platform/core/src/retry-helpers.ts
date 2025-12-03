import { expect, Page } from '@playwright/test';

/**
 * ♻️ Wiederholungs-Utilities für flaky Tests
 */
export class RetryHelpers {
  /**
   * Wiederholt eine Aktion mit Backoff bis sie erfolgreich ist.
   */
  static async retryUntil<T>(fn: () => Promise<T>, attempts = 3, delayMs = 500): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < attempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        }
      }
    }
    throw lastError;
  }

  /**
   * Wartet wiederholt auf ein Element, falls es asynchron gerendert wird.
   */
  static async waitForVisible(page: Page, selector: string, timeout = 5000) {
    await expect(page.locator(selector)).toBeVisible({ timeout });
  }
}
