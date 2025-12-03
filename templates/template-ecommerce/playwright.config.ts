import { buildTemplatePlaywrightConfig } from '@test-platform/core';
import { ciReporters, localReporters } from '@test-platform/reporting';
import { env } from './config/env';

export default buildTemplatePlaywrightConfig({
  env,
  globalSetup: './global-setup.ts',
  reporters: {
    ci: ciReporters,
    local: localReporters
  },
  roleProjects: [
    {
      name: 'admin-chromium',
      storageState: env.ADMIN_STORAGE_STATE,
      testMatch: '**/admin/**'
    },
    {
      name: 'merchant-chromium',
      storageState: env.EDITOR_STORAGE_STATE,
      testMatch: '**/editor/**'
    },
    {
      name: 'viewer-chromium',
      storageState: env.VIEWER_STORAGE_STATE,
      testMatch: '**/viewer/**'
    }
  ]
});
