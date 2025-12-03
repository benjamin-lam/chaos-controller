import { chromium, type FullConfig } from '@playwright/test';
import { mkdirSync, rmSync } from 'fs';
import path from 'path';
import { loadEnvForStage } from './env-loader';

interface StorageStateOptions {
  baseURL: string;
  loginPath: string;
  dashboardSelector: string;
  emailSelector: string;
  passwordSelector: string;
  submitSelector: string;
  credentials?: { email?: string; password?: string };
  storagePath: string;
}

async function createStorageState(params: StorageStateOptions) {
  if (!params.credentials?.email || !params.credentials?.password) {
    console.warn(`⚠️  Überspringe Storage-State ${params.storagePath} (fehlende Credentials).`);
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: params.baseURL });
  const page = await context.newPage();

  await page.goto(params.loginPath);
  await page.fill(params.emailSelector, params.credentials.email);
  await page.fill(params.passwordSelector, params.credentials.password);
  await page.click(params.submitSelector);
  await page.waitForSelector(params.dashboardSelector, { timeout: 15_000 });

  mkdirSync(path.dirname(params.storagePath), { recursive: true });
  await context.storageState({ path: params.storagePath });

  await browser.close();
  console.log(`✅ Storage-State geschrieben: ${params.storagePath}`);
}

function cleanupOldStates(...pathsToClean: string[]) {
  pathsToClean.forEach((filePath) => {
    if (!filePath) return;
    try {
      rmSync(filePath, { force: true });
    } catch (error) {
      console.warn(`⚠️ Konnte ${filePath} nicht löschen: ${String(error)}`);
    }
  });
}

async function globalSetup(_config: FullConfig) {
  const env = loadEnvForStage();

  cleanupOldStates(env.STORAGE_STATE, env.ADMIN_STORAGE_STATE, env.EDITOR_STORAGE_STATE, env.VIEWER_STORAGE_STATE);

  const commonParams = {
    baseURL: env.BASE_URL,
    loginPath: env.LOGIN_PATH,
    dashboardSelector: env.DASHBOARD_SELECTOR,
    emailSelector: env.EMAIL_SELECTOR,
    passwordSelector: env.PASSWORD_SELECTOR,
    submitSelector: env.SUBMIT_SELECTOR
  } as const;

  await createStorageState({
    ...commonParams,
    credentials: { email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD },
    storagePath: env.ADMIN_STORAGE_STATE
  });

  await createStorageState({
    ...commonParams,
    credentials: { email: env.EDITOR_EMAIL, password: env.EDITOR_PASSWORD },
    storagePath: env.EDITOR_STORAGE_STATE
  });

  await createStorageState({
    ...commonParams,
    credentials: { email: env.VIEWER_EMAIL, password: env.VIEWER_PASSWORD },
    storagePath: env.VIEWER_STORAGE_STATE
  });
}

export default globalSetup;
