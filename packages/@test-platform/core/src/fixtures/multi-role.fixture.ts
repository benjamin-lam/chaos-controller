import fs from 'fs';
import { test as base, type BrowserContext, type Page } from '@playwright/test';
import { loadEnvForStage } from '../env-loader';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

export interface RoleFixtures {
  adminContext: BrowserContext;
  adminPage: Page;
  editorContext: BrowserContext;
  editorPage: Page;
  viewerPage: Page;
  guestPage: Page;
  switchToRole: (role: UserRole) => Promise<Page>;
  getPageForRole: (role: UserRole) => Promise<Page>;
  assertRoleHasAccess: (role: UserRole, url: string) => Promise<void>;
  assertRoleNoAccess: (role: UserRole, url: string) => Promise<void>;
}

const env = loadEnvForStage({ requireFile: false });
const ROLE_STORAGE_PATHS: Record<UserRole, string> = {
  [UserRole.ADMIN]: env.ADMIN_STORAGE_STATE,
  [UserRole.EDITOR]: env.EDITOR_STORAGE_STATE,
  [UserRole.VIEWER]: env.VIEWER_STORAGE_STATE,
  [UserRole.GUEST]: ''
};

export const test = base.extend<RoleFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: ROLE_STORAGE_PATHS[UserRole.ADMIN] });
    await use(context);
    await context.close();
  },
  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    await use(page);
    await page.close();
  },
  editorContext: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: ROLE_STORAGE_PATHS[UserRole.EDITOR] });
    await use(context);
    await context.close();
  },
  editorPage: async ({ editorContext }, use) => {
    const page = await editorContext.newPage();
    await use(page);
    await page.close();
  },
  viewerPage: async ({ browser }, use) => {
    const storagePath = ROLE_STORAGE_PATHS[UserRole.VIEWER];
    const context = await browser.newContext({
      storageState: fs.existsSync(storagePath) ? storagePath : undefined
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  guestPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  switchToRole: async ({ browser }, use) => {
    const rolePages = new Map<UserRole, Page>();

    await use(async (role: UserRole) => {
      if (rolePages.has(role)) {
        return rolePages.get(role)!;
      }

      const storageState = ROLE_STORAGE_PATHS[role];
      const context = await browser.newContext({
        storageState: storageState && fs.existsSync(storageState) ? storageState : undefined
      });
      const page = await context.newPage();
      rolePages.set(role, page);
      return page;
    });

    for (const page of rolePages.values()) {
      await page.context().close();
    }
  },
  getPageForRole: async ({ switchToRole }, use) => {
    await use(async (role: UserRole) => switchToRole(role));
  },
  assertRoleHasAccess: async ({}, use) => {
    await use(async (_role: UserRole, url: string) => {
      // BITTE ANPASSEN: Hier projektspezifische Assertions ergänzen
      if (!url) throw new Error('URL für Rollen-Assertion fehlt');
    });
  },
  assertRoleNoAccess: async ({}, use) => {
    await use(async (_role: UserRole, url: string) => {
      // BITTE ANPASSEN: Hier projektspezifische Assertions ergänzen
      if (!url) throw new Error('URL für Rollen-Assertion fehlt');
    });
  }
});

export { expect } from '@playwright/test';
