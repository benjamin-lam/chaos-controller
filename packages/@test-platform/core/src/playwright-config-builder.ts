import { defineConfig, devices, type PlaywrightTestConfig, type ReporterDescription } from '@playwright/test';
import { TAGS, TestMatrix } from './test-matrix';
import { ciConfig } from './config-presets';
import type { StageEnvironmentConfig } from './env-loader';

export interface RoleProjectConfig {
  name: string;
  storageState: string;
  testMatch: string;
}

export interface TemplateConfigOptions {
  env: StageEnvironmentConfig;
  roleProjects?: RoleProjectConfig[];
  suite?: string;
  reporters?: {
    ci?: ReporterDescription[];
    local?: ReporterDescription[];
  };
  globalSetup?: PlaywrightTestConfig['globalSetup'];
  use?: PlaywrightTestConfig['use'];
  projects?: PlaywrightTestConfig['projects'];
  metadataTags?: string[];
  grep?: PlaywrightTestConfig['grep'];
}

const defaultViewport = { width: 1280, height: 720 } as const;

const buildRoleProjects = (roleProjects?: RoleProjectConfig[]): PlaywrightTestConfig['projects'] =>
  (roleProjects ?? []).map((role) => ({
    name: role.name,
    use: { ...devices['Desktop Chrome'], storageState: role.storageState },
    testMatch: role.testMatch
  }));

const resolveProjects = (
  suite: string,
  roleProjects?: RoleProjectConfig[],
  explicitProjects?: PlaywrightTestConfig['projects']
): PlaywrightTestConfig['projects'] => {
  if (explicitProjects) return explicitProjects;
  if (suite === 'smoke') return [TestMatrix.smoke];
  if (suite === 'a11y') return [TestMatrix.a11y];

  return [
    ...buildRoleProjects(roleProjects),
    ...(TestMatrix.regression as Array<any>),
    ...(TestMatrix.mobile as Array<any>),
    TestMatrix.a11y
  ];
};

export const buildTemplatePlaywrightConfig = (options: TemplateConfigOptions): PlaywrightTestConfig => {
  const suite = options.suite ?? options.env.TEST_SUITE ?? process.env.TEST_SUITE ?? 'regression';
  const headless = options.env.HEADLESS;
  const videoMode = process.env.CI ? 'retain-on-failure' : 'off';
  const testTag = options.env.TEST_TAG ?? process.env.TEST_TAG;

  return defineConfig({
    ...ciConfig,
    globalSetup: options.globalSetup,
    use: {
      baseURL: options.env.BASE_URL,
      trace: options.env.ENABLE_TRACES ? 'on-first-retry' : 'off',
      screenshot: options.env.ENABLE_SCREENSHOTS ? 'only-on-failure' : 'off',
      storageState: options.env.EDITOR_STORAGE_STATE,
      actionTimeout: options.env.ACTION_TIMEOUT,
      navigationTimeout: options.env.NAVIGATION_TIMEOUT,
      viewport: options.use?.viewport ?? defaultViewport,
      headless,
      video: options.use?.video ?? videoMode,
      ...options.use
    },
    projects: resolveProjects(suite, options.roleProjects, options.projects),
    grep: testTag ? new RegExp(testTag) : options.grep,
    reporter: process.env.CI ? options.reporters?.ci ?? 'list' : options.reporters?.local ?? 'list',
    metadata: {
      tags: options.metadataTags ?? Object.values(TAGS)
    }
  });
};
