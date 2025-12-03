// CORE UTILITIES - NUR GENERISCHE HELPER
// KEINE Business Logic, KEINE Page Objects!

export * from './test-utils';
export * from './retry-helpers';
export * from './screenshot-utils';
export * from './config-presets';
export * from './env-validator';
export * from './env-loader';
export * from './device-matrix';
export * from './quality-gates';
export * from './test-matrix';
export * from './fixtures/multi-role.fixture';
export { default as globalSetup } from './global-setup';

// Beispiel: Network Helper
// Diese Utility kann in allen Projekten genutzt werden, um auf ein "stilles" Netzwerk zu warten.
// Bitte passe ggf. Timeout oder Events an deine Applikation an.
export class NetworkUtils {
  /**
   * Wartet darauf, dass die Netzwerkaktivität der Seite zur Ruhe kommt.
   * Kann vor Screenshots oder nach kritischen Aktionen genutzt werden.
   */
  static async waitForNetworkIdle(
    page: { waitForLoadState: (state: string, options?: { timeout?: number }) => Promise<void> },
    timeout = 5000
  ) {
    await page.waitForLoadState('networkidle', { timeout });
  }
}
