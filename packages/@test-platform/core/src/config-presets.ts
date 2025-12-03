/**
 * 🎯 KONFIGURATION-VORLAGEN
 * Importiere diese in deiner playwright.config.ts
 */
export const fastConfig = {
  timeout: 10000,
  retries: 1,
  workers: 4
};

export const thoroughConfig = {
  timeout: 30000,
  retries: 3,
  workers: 2
};

export const ciConfig = {
  timeout: 60000,
  retries: 2,
  workers: process.env.CI ? 4 : 2
};
