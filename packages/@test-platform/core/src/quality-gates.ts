/**
 * ✅ Standardisierte Quality-Gates für Timeouts, Retries und Netzwerkeinstellungen.
 * Diese Werte können in CI-Pipelines als Defaults genutzt werden.
 */
export const QualityGates = {
  timeouts: {
    smoke: { navigation: 10_000, action: 5_000 },
    regression: { navigation: 30_000, action: 10_000 },
    performance: { navigation: 60_000, action: 30_000 }
  },
  retries: {
    ci: 2,
    local: 1,
    flaky: 3
  },
  performance: {
    maxFirstContentfulPaint: 2000,
    maxLargestContentfulPaint: 4000,
    maxCumulativeLayoutShift: 0.1
  },
  network: {
    blockThirdParty: true,
    offlineMode: false,
    throttleProfile: process.env.CI ? 'Slow 3G' : 'Fast 3G'
  },
  visual: {
    threshold: 0.01,
    maxDiffPixels: 100,
    maxDiffPixelRatio: 0.01
  }
};

/**
 * Hilfs-Utilities für Netzwerk- und Stabilitätskontrollen.
 */
export class NetworkUtilities {
  /**
   * Blockiert externe Requests (ausgenommen eigene Domain) – optional anpassen.
   */
  static async blockExternalResources(page: { route: Function; context: Function }) {
    await (page as any).route('**/*', (route: any) => {
      const url = route.request().url();
      const isThirdParty = !url.includes('localhost') && !url.includes('127.0.0.1');
      if (isThirdParty) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }
}
