// scanner/scanner.config.ts
// ⚠️ Diese Datei an dein Projekt anpassen.

import type { ScannerConfig } from './crawler.config';

export const scannerConfig: ScannerConfig = {
  // ⚠️ Beispiel-Setup: PHP-Testserver unter /examples/php-test-server
  baseUrl: 'http://localhost:8080',
  // Globale kleine Pause zwischen Requests
  requestDelayMs: 100,

  roles: [
    {
      name: 'public',
      type: 'public',
      crawl: {
        startPaths: ['/', '/login.php', '/forms/registration.php', '/forms/contact.php', '/forms/upload.php'],
        // ⚠️ Auf Beispiel-Routen begrenzt
        includePatterns: [
          /^\/(index\.php)?$/,
          /^\/login\.php(\?.*)?$/,
          /^\/forms\/[a-z-]+\.php(\?.*)?$/,
        ],
        // ⚠️ Bereiche ausschließen
        excludePatterns: [/error=timeout/i, /delay=\d+/i, /\/logs\b/],
        maxPages: 40,
        maxDepth: 2,
      },
    },
    {
      name: 'authenticated',
      type: 'login',
      // ⚠️ Optional: Storage-State Datei, falls bereits erzeugt.
      storageStateFile: undefined,
      login: {
        // ⚠️ URL des Login-Formulars
        loginPath: '/login.php',
        // ⚠️ Demo-Credentials – anpassen!
        credentials: {
          USERNAME: 'test',
          PASSWORD: 'test123',
        },
        steps: [
          { action: 'goto', url: '/login.php' },
          { action: 'fill', selector: '#username', valueKey: 'USERNAME' },
          { action: 'fill', selector: '#password', valueKey: 'PASSWORD' },
          { action: 'click', selector: 'button[type="submit"]' },
          { action: 'waitForURL', pattern: '/dashboard\.php' },
        ],
      },
      crawl: {
        // ⚠️ Auth-geschützte Bereiche
        startPaths: ['/dashboard.php'],
        includePatterns: [/^\/(dashboard\.php)(\?.*)?$/],
        excludePatterns: [/\/api\/auth\/logout\b/, /error=timeout/i],
        maxPages: 20,
        maxDepth: 1,
      },
    },
  ],

  vocabulary: {
    components: [
      {
        name: 'header',
        selectors: ['header', '[role="banner"]'],
      },
      {
        name: 'footer',
        selectors: ['footer', '[role="contentinfo"]'],
      },
      {
        name: 'navigation',
        selectors: ['nav', '[role="navigation"]', '.main-nav'],
      },
      {
        name: 'hero',
        selectors: ['.hero', '.hero-banner', '.hero-section', '.masthead'],
        classNameRegex: /hero/i,
        special: 'hero',
      },
      {
        name: 'slider',
        selectors: ['.slider', '.carousel', '.swiper'],
        classNameRegex: /(slider|carousel|swiper)/i,
        special: 'slider',
      },
      {
        name: 'login',
        selectors: ['form[action*="login"]'],
        special: 'login',
      },
      {
        name: 'table',
        selectors: ['table', '[role="table"]'],
      },
      {
        name: 'form',
        selectors: ['form'],
      },
      {
        name: 'button-primary',
        selectors: ['.btn-primary', '.button--primary'],
      },
      {
        name: 'cta',
        classNameRegex: /cta-/i,
      },
      // ⚠️ Hier kannst du projektspezifische Vokabeln ergänzen:
      // z.B. Produkt-Karten, Teaser, etc.
      // {
      //   name: 'product-card',
      //   classNameRegex: /product-card/i,
      // },
    ],
  },
};

