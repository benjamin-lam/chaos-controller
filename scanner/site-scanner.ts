// scanner/site-scanner.ts

import { chromium, type Page, type BrowserContext } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  scannerConfig,
} from './scanner.config';
import {
  type RoleConfig,
  type ScannerConfig,
  type ProjectVocabulary,
  type PageComponentSummary,
  type ScanResult,
} from './crawler.config';

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validateConfig(config: ScannerConfig): void {
  if (!config.baseUrl) {
    throw new Error('Scanner-Konfiguration: baseUrl ist nicht gesetzt.');
  }
  if (!config.roles || config.roles.length === 0) {
    throw new Error('Scanner-Konfiguration: Es sind keine Rollen definiert.');
  }
  for (const role of config.roles) {
    if (!role.name) {
      throw new Error('Scanner-Konfiguration: Rolle ohne Namen gefunden.');
    }
    if (!role.crawl || !role.crawl.startPaths || role.crawl.startPaths.length === 0) {
      throw new Error(`Scanner-Konfiguration: Rolle "${role.name}" hat keine startPaths.`);
    }
  }
}

function isAllowed(pathPart: string, crawlConfig: RoleConfig['crawl']): boolean {
  const { includePatterns, excludePatterns } = crawlConfig;

  if (excludePatterns) {
    for (const pattern of excludePatterns) {
      if (pattern.test(pathPart)) {
        return false;
      }
    }
  }

  if (includePatterns && includePatterns.length > 0) {
    return includePatterns.some((pattern) => pattern.test(pathPart));
  }

  return true;
}

function normalizeHref(href: string, baseUrl: string): string | null {
  try {
    const trimmed = href.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('#')) return null;
    if (trimmed.startsWith('mailto:')) return null;
    if (trimmed.startsWith('tel:')) return null;
    const lowerHref = trimmed.toLowerCase();
    if (lowerHref.startsWith('javascript:') || lowerHref.startsWith('data:')) return null;

    if (trimmed.match(/\.(pdf|jpg|jpeg|png|gif|svg|zip|css|js|ico)$/i)) {
      return null;
    }

    if (trimmed.startsWith('http')) {
      const target = new URL(trimmed);
      const base = new URL(baseUrl);
      if (target.host !== base.host) {
        return null;
      }
      return target.pathname.split('#')[0] || '/';
    }

    if (!trimmed.startsWith('/')) {
      return '/' + trimmed.split('#')[0];
    }

    return trimmed.split('#')[0] || '/';
  } catch {
    return null;
  }
}

async function collectLinks(page: Page, baseUrl: string): Promise<string[]> {
  const hrefs = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    return anchors.map((a) => a.getAttribute('href') || '').filter(Boolean);
  });

  const result = new Set<string>();
  for (const href of hrefs) {
    const normalized = normalizeHref(href, baseUrl);
    if (normalized) {
      result.add(normalized);
    }
  }
  return Array.from(result);
}

async function runLogin(page: Page, baseUrl: string, role: RoleConfig): Promise<void> {
  const login = role.login;
  if (!login) {
    console.warn(`⚠️ Rolle "${role.name}" ist als login markiert, aber hat keine login-Konfiguration.`);
    return;
  }

  const { credentials, steps } = login;
  if (!steps || steps.length === 0) {
    console.warn(`⚠️ Login-Konfiguration für Rolle "${role.name}" hat keine Schritte.`);
    return;
  }
  console.log(`🔐 [${role.name}] Führe Login-Schritte aus…`);

  for (const step of steps) {
    switch (step.action) {
      case 'goto': {
        if (!step.url) {
          console.warn(`⚠️ Login-Step "goto" ohne URL in Rolle "${role.name}"`);
          continue;
        }
        const url = new URL(step.url, baseUrl).toString();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((err) => {
          console.error(`❌ [${role.name}] Fehler bei goto(${url}):`, err);
        });
        break;
      }
      case 'fill': {
        if (!step.selector || !step.valueKey) {
          console.warn(`⚠️ Login-Step "fill" ohne selector/valueKey in Rolle "${role.name}"`);
          continue;
        }
        const value = credentials[step.valueKey] ?? '';
        await page.fill(step.selector, value).catch((err) => {
          console.error(`❌ [${role.name}] Fehler bei fill(${step.selector}):`, err);
        });
        break;
      }
      case 'click': {
        if (!step.selector) {
          console.warn(`⚠️ Login-Step "click" ohne selector in Rolle "${role.name}"`);
          continue;
        }
        await page.click(step.selector).catch((err) => {
          console.error(`❌ [${role.name}] Fehler bei click(${step.selector}):`, err);
        });
        break;
      }
      case 'waitForURL': {
        if (!step.pattern) {
          console.warn(`⚠️ Login-Step "waitForURL" ohne pattern in Rolle "${role.name}"`);
          continue;
        }
        const regex = new RegExp(step.pattern);
        await page.waitForURL(regex, { timeout: 30000 }).catch((err) => {
          console.error(`❌ [${role.name}] Fehler bei waitForURL(${step.pattern}):`, err);
        });
        break;
      }
      default:
        console.warn(`⚠️ Unbekannter Login-Step "${(step as any).action}" in Rolle "${role.name}"`);
    }
  }

  console.log(`✅ [${role.name}] Login-Schritte abgeschlossen (best-effort).`);
}

async function analyzeWithVocabulary(
  page: Page,
  url: string,
  status: number,
  vocabulary: ProjectVocabulary,
  roleName: string,
  depth: number,
  error?: string
): Promise<PageComponentSummary> {
  let title: string | null = null;
  try {
    title = await page.title();
  } catch {
    // kann bei harten Fehlern passieren
  }

  const components = error
    ? {}
    : await page.evaluate((vocab: ProjectVocabulary) => {
        const result: Record<string, number> = {};
        const allWithClass = Array.from(document.querySelectorAll<HTMLElement>('[class]'));

        const countForPattern = (pattern: { selectors?: string[]; classNameRegex?: RegExp; special?: string; name: string }): number => {
          let count = 0;

          if (pattern.selectors && pattern.selectors.length > 0) {
            for (const sel of pattern.selectors) {
              try {
                count += document.querySelectorAll(sel).length;
              } catch {
                // ungültiger Selector – ignorieren
              }
            }
          }

          if (pattern.classNameRegex) {
            const regex = new RegExp(pattern.classNameRegex);
            count += allWithClass.filter((el) => regex.test(el.className)).length;
          }

          if (pattern.special === 'login') {
            const hasPassword = !!document.querySelector('input[type="password"]');
            const hasLoginText = Array.from(
              document.querySelectorAll<HTMLElement>('button, a, input[type="submit"]')
            )
              .map((el) => (el.textContent || '').toLowerCase())
              .some((text) =>
                text.includes('login') ||
                text.includes('anmelden') ||
                text.includes('einloggen') ||
                text.includes('sign in')
              );
            if (hasPassword || hasLoginText) {
              count = Math.max(count, 1);
            }
          }

          return count;
        };

        for (const comp of vocab.components) {
          result[comp.name] = countForPattern(comp);
        }

        return result;
      }, vocabulary);

  return {
    role: roleName,
    url,
    title,
    status,
    depth,
    components,
    ...(error ? { error } : {}),
  };
}

async function crawlForRole(role: RoleConfig, config: ScannerConfig): Promise<PageComponentSummary[]> {
  const baseUrl = config.baseUrl;
  const delayMs = config.requestDelayMs ?? 0;
  const { crawl } = role;

  console.log(`\n🚀 Starte Crawl für Rolle "${role.name}"…`);

  const browser = await chromium.launch({ headless: true });
  let context: BrowserContext;

  if (role.storageStateFile) {
    try {
      context = await browser.newContext({ storageState: role.storageStateFile });
      console.log(`💾 [${role.name}] Nutze Storage State: ${role.storageStateFile}`);
    } catch (err) {
      console.warn(`⚠️ [${role.name}] Konnte Storage State "${role.storageStateFile}" nicht laden:`, err);
      context = await browser.newContext();
    }
  } else {
    context = await browser.newContext();
  }

  const page = await context.newPage();

  if (role.type === 'login' && !role.storageStateFile) {
    await runLogin(page, baseUrl, role);
  }

  type QueueItem = { path: string; depth: number };
  const initialPaths = Array.from(
    new Set(crawl.startPaths.filter((pathPart) => pathPart.trim().length > 0))
  );
  const queue: QueueItem[] = initialPaths.map((p) => ({ path: p, depth: 0 }));
  const visited = new Set<string>();
  const summaries: PageComponentSummary[] = [];

  const maxPages = crawl.maxPages ?? 100;
  const maxDepth = crawl.maxDepth ?? 10;

  while (queue.length > 0 && visited.size < maxPages) {
    const { path: pathPart, depth } = queue.shift() as QueueItem;

    if (visited.has(pathPart)) continue;
    visited.add(pathPart);

    if (depth > maxDepth) continue;
    if (!isAllowed(pathPart, crawl)) continue;

    const url = new URL(pathPart, baseUrl).toString();
    console.log(`🔍 [${role.name}] Scanne (Depth ${depth}): ${url}`);

    let status = 0;
    let error: string | undefined;

    try {
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      status = response?.status() ?? 0;
    } catch (err: any) {
      error = `goto failed: ${err?.message ?? String(err)}`;
      console.error(`❌ [${role.name}] Fehler beim Laden von ${url}:`, err);
    }

    let summary: PageComponentSummary;
    try {
      summary = await analyzeWithVocabulary(page, url, status, config.vocabulary, role.name, depth, error);
    } catch (err: any) {
      console.error(`❌ [${role.name}] Fehler bei Analyse von ${url}:`, err);
      summary = {
        role: role.name,
        url,
        title: null,
        status,
        depth,
        components: {},
        error: `analyze failed: ${err?.message ?? String(err)}`,
      };
    }

    summaries.push(summary);

    if (!error) {
      try {
        const links = await collectLinks(page, baseUrl);
        for (const href of links) {
          if (!visited.has(href) && !queue.some((q) => q.path === href)) {
            queue.push({ path: href, depth: depth + 1 });
          }
        }
      } catch (err) {
        console.warn(`⚠️ [${role.name}] Konnte Links auf ${url} nicht auslesen:`, err);
      }
    }

    if (delayMs > 0) {
      await delay(delayMs);
    }
  }

  await browser.close();

  console.log(`✅ Rolle "${role.name}" fertig: ${summaries.length} Seiten gescannt.`);

  return summaries;
}

async function writeReports(result: ScanResult): Promise<void> {
  const outDir = path.join(process.cwd(), 'scanner-output');
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'site-report.json');
  const mdPath = path.join(outDir, 'site-report.md');

  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2), 'utf-8');

  const lines: string[] = [];
  lines.push('# Site Scan Report');
  lines.push('');
  lines.push(`Generiert am: ${result.generatedAt}`);
  lines.push('');
  lines.push(`Base URL: ${result.config.baseUrl}`);
  lines.push('');

  const byRole: Record<string, PageComponentSummary[]> = {};
  for (const page of result.pages) {
    byRole[page.role] ??= [];
    byRole[page.role].push(page);
  }

  for (const [role, pages] of Object.entries(byRole)) {
    lines.push(`## Rolle: ${role}`);
    lines.push('');
    lines.push(`Gesamt Seiten: ${pages.length}`);
    lines.push('');

    for (const page of pages) {
      lines.push(`### ${page.url}`);
      lines.push('');
      lines.push(`- Titel: ${page.title ?? '—'}`);
      lines.push(`- Status: ${page.status}`);
      lines.push(`- Tiefe: ${page.depth}`);
      if (page.error) {
        lines.push(`- Fehler: \`${page.error}\``);
      }
      lines.push('');
      if (Object.keys(page.components).length > 0) {
        lines.push('**Komponenten:**');
        lines.push('');
        for (const [name, count] of Object.entries(page.components)) {
          lines.push(`- ${name}: ${count}`);
        }
        lines.push('');
      } else {
        lines.push('_Keine Komponenten erkannt (oder Analyse fehlgeschlagen)._');
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('');
  }

  await fs.writeFile(mdPath, lines.join('\n'), 'utf-8');

  console.log(`📄 Reports geschrieben nach:`);
  console.log(`   - ${jsonPath}`);
  console.log(`   - ${mdPath}`);
}

async function main(): Promise<void> {
  validateConfig(scannerConfig);

  const allPages: PageComponentSummary[] = [];

  for (const role of scannerConfig.roles) {
    const summaries = await crawlForRole(role, scannerConfig);
    allPages.push(...summaries);
  }

  const result: ScanResult = {
    config: scannerConfig,
    generatedAt: new Date().toISOString(),
    pages: allPages,
  };

  await writeReports(result);
}

// Direkt ausführbar machen
if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Fehler im Site Scanner:', err);
    process.exit(1);
  });
}

