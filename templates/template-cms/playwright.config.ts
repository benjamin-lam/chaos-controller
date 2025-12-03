import { defineConfig, devices } from '@playwright/test';
import { TAGS, TestMatrix, ciConfig } from '@test-platform/core';
import { ciReporters, localReporters } from '@test-platform/reporting';
import { env } from './config/env';

const suite = process.env.TEST_SUITE ?? 'regression';
const headless = process.env.HEADLESS !== 'false';
const videoMode = process.env.CI ? 'retain-on-failure' : 'off';
const viewport = { width: 1280, height: 720 };
const projects = (() => {
  if (suite === 'smoke') return [TestMatrix.smoke];
  if (suite === 'a11y') return [TestMatrix.a11y];
  return [
    // Rollenbasiert – nutzt vorbereitete Storage States aus dem global setup
    {
      name: 'admin-chromium',
      use: { ...devices['Desktop Chrome'], storageState: env.ADMIN_STORAGE_STATE },
      testMatch: '**/admin/**'
    },
    {
      name: 'editor-chromium',
      use: { ...devices['Desktop Chrome'], storageState: env.EDITOR_STORAGE_STATE },
      testMatch: '**/editor/**'
    },
    {
      name: 'viewer-chromium',
      use: { ...devices['Desktop Chrome'], storageState: env.VIEWER_STORAGE_STATE },
      testMatch: '**/viewer/**'
    },
    ...(TestMatrix.regression as Array<any>),
    ...(TestMatrix.mobile as Array<any>),
    TestMatrix.a11y
  ];
})();

export default defineConfig({
  ...ciConfig,
  globalSetup: './global-setup.ts',
  use: {
    baseURL: env.BASE_URL,
    trace: env.ENABLE_TRACES ? 'on-first-retry' : 'off',
    screenshot: env.ENABLE_SCREENSHOTS ? 'only-on-failure' : 'off',
    storageState: env.EDITOR_STORAGE_STATE,
    actionTimeout: env.ACTION_TIMEOUT,
    navigationTimeout: env.NAVIGATION_TIMEOUT,
    viewport,
    headless,
    video: videoMode
  },
  projects,
  grep: process.env.TEST_TAG ? new RegExp(process.env.TEST_TAG) : undefined,
  reporter: process.env.CI ? ciReporters : localReporters,
  metadata: {
    tags: Object.values(TAGS)
  }
});
