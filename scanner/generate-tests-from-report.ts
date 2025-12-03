// scanner/generate-tests-from-report.ts
//
// Liest scanner-output/site-report.json und generiert
// Playwright-Test-Skeletons unter /tests/generated/.
//
// ⚠️ Du kannst die Pfade unten bei Bedarf anpassen.

import fs from 'node:fs/promises';
import path from 'node:path';
import type { ScanResult, PageComponentSummary } from './crawler.config';

// Pfad zum Report des Scanners
const REPORT_PATH = path.join(process.cwd(), 'scanner-output', 'site-report.json');

// Zielordner für generierte Tests
const TEST_ROOT = path.join(process.cwd(), 'tests', 'generated');

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/https?:\/\//g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'root'
  );
}

function getPathFromUrl(fullUrl: string): string {
  try {
    const u = new URL(fullUrl);
    return u.pathname || '/';
  } catch {
    // Falls es doch schon ein Pfad ist
    if (!fullUrl.startsWith('/')) {
      return '/' + fullUrl;
    }
    return fullUrl;
  }
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\//g, '\\/');
}

function buildSpecContent(page: PageComponentSummary, routePath: string): string {
  const { role, url, components, title, status } = page;
  const hasLogin = (components['login'] ?? 0) > 0;
  const hasForms = (components['form'] ?? 0) > 0;
  const hasTables = (components['table'] ?? 0) > 0;
  const hasHeader = (components['header'] ?? 0) > 0;
  const hasFooter = (components['footer'] ?? 0) > 0;
  const hasNavigation = (components['navigation'] ?? 0) > 0;

  const lines: string[] = [];

  lines.push(`import { test, expect } from '@playwright/test';`);
  lines.push('');
  lines.push('/**');
  lines.push(' * 🔧 AUTO-GENERIERTES TESTSKELETT');
  lines.push(' *');
  lines.push(` * Rolle: ${role}`);
  lines.push(` * URL: ${url}`);
  lines.push(` * Pfad: ${routePath}`);
  lines.push(` * Titel (zum Scanzeitpunkt): ${title ?? '—'}`);
  lines.push(` * HTTP-Status (zum Scanzeitpunkt): ${status}`);
  lines.push(' *');
  lines.push(' * ⚠️ Bitte manuell verfeinern, Selektoren prüfen und ggf. Business-Logik ergänzen.');
  lines.push(' */');
  lines.push('');

  // Gruppen-Describe pro Seite
  lines.push(`test.describe('[${role}] ${routePath}', () => {`);
  lines.push('');

  // Basis-Test: Seite lädt
  lines.push(`  test('Seite lädt ohne Fehler (Basis-Check)', async ({ page }) => {`);
  lines.push(`    await page.goto('${routePath}');`);
  lines.push(`    // ⚠️ Optional: spezifische Erwartungen ergänzen (Titel, sichtbare Elemente, etc.)`);
  lines.push(`    await expect(page).toHaveURL(/${escapeRegex(routePath)}/);`);
  lines.push('  });');
  lines.push('');

  if (hasLogin) {
    lines.push(`  test('Login-Bereich vorhanden', async ({ page }) => {`);
    lines.push(`    await page.goto('${routePath}');`);
    lines.push('');
    lines.push('    // ⚠️ Selektoren an Projekt anpassen');
    lines.push(`    const passwordField = page.locator('input[type="password"]');`);
    lines.push('    await expect(passwordField).toBeVisible();');
    lines.push('');
    lines.push('    // Optional: Buttons/Links mit "Login"/"Anmelden" prüfen');
    lines.push('    // const loginButton = page.getByRole(\'button\', { name: /login|anmelden|einloggen/i });');
    lines.push('    // await expect(loginButton).toBeVisible();');
    lines.push('  });');
    lines.push('');
  }

  if (hasForms) {
    lines.push(`  test('Mindestens ein Formular ist vorhanden', async ({ page }) => {`);
    lines.push(`    await page.goto('${routePath}');`);
    lines.push('');
    lines.push("    const forms = page.locator('form');");
    lines.push('    const formCount = await forms.count();');
    lines.push('    expect(formCount).toBeGreaterThan(0);');
    lines.push('');
    lines.push('    // ⚠️ Hier spezifischere Formular-Tests ergänzen (Pflichtfelder, Validierung, etc.)');
    lines.push('  });');
    lines.push('');
  }

  if (hasTables) {
    lines.push(`  test('Tabellenstruktur vorhanden', async ({ page }) => {`);
    lines.push(`    await page.goto('${routePath}');`);
    lines.push('');
    lines.push("    const tables = page.locator('table, [role=\"table\"]');");
    lines.push('    const tableCount = await tables.count();');
    lines.push('    expect(tableCount).toBeGreaterThan(0);');
    lines.push('');
    lines.push('    // ⚠️ Optional: Kopfzeilen, Zeilenanzahl, Sortierung etc. testen');
    lines.push('  });');
    lines.push('');
  }

  if (hasHeader || hasFooter || hasNavigation) {
    lines.push(`  test('Layout-Grundstruktur (Header / Navigation / Footer)', async ({ page }) => {`);
    lines.push(`    await page.goto('${routePath}');`);
    lines.push('');
    if (hasHeader) {
      lines.push('    // Header prüfen');
      lines.push(`    const header = page.locator('header, [role=\"banner\"]');`);
      lines.push('    await expect(header).toBeVisible();');
      lines.push('');
    }
    if (hasNavigation) {
      lines.push('    // Navigation prüfen');
      lines.push(`    const nav = page.locator('nav, [role=\"navigation\"], .main-nav');`);
      lines.push('    await expect(nav).toBeVisible();');
      lines.push('');
    }
    if (hasFooter) {
      lines.push('    // Footer prüfen');
      lines.push(`    const footer = page.locator('footer, [role=\"contentinfo\"]');`);
      lines.push('    await expect(footer).toBeVisible();');
      lines.push('');
    }
    lines.push('  });');
    lines.push('');
  }

  lines.push('});');
  lines.push('');

  return lines.join('\n');
}

async function generateTestsFromReport(): Promise<void> {
  const exists = await fileExists(REPORT_PATH);
  if (!exists) {
    throw new Error(
      `Report-Datei nicht gefunden: ${REPORT_PATH}.\nBitte zuerst den Site-Scanner ausführen.`
    );
  }

  const raw = await fs.readFile(REPORT_PATH, 'utf-8');
  const scanResult = JSON.parse(raw) as ScanResult;

  await fs.mkdir(TEST_ROOT, { recursive: true });

  console.log('🧩 Generiere Test-Skeletons aus site-report.json …');
  console.log(`   Quelle: ${REPORT_PATH}`);
  console.log(`   Ziel  : ${TEST_ROOT}`);
  console.log('');

  let generatedCount = 0;
  let skippedCount = 0;

  for (const page of scanResult.pages) {
    const routePath = getPathFromUrl(page.url);
    const slugBase = `${page.role}-${routePath}`;
    const slug = slugify(slugBase);
    const fileName = `${slug}.spec.ts`;
    const targetPath = path.join(TEST_ROOT, fileName);

    if (await fileExists(targetPath)) {
      console.log(`↷ Überspringe (existiert bereits): ${fileName}`);
      skippedCount++;
      continue;
    }

    const content = buildSpecContent(page, routePath);
    await fs.writeFile(targetPath, content, 'utf-8');
    console.log(`✅ Generiert: ${fileName}`);
    generatedCount++;
  }

  console.log('');
  console.log(`Fertig. Generiert: ${generatedCount}, übersprungen (bereits vorhanden): ${skippedCount}`);
}

if (require.main === module) {
  generateTestsFromReport().catch((err) => {
    console.error('❌ Fehler beim Generieren der Tests:', err);
    process.exit(1);
  });
}
