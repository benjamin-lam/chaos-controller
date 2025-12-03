import { Reporter, TestCase, TestResult } from '@playwright/test';
import path from 'path';
import fs from 'fs-extra';

/**
 * Minimaler JUnit-Reporter, der mit CI-Servern funktioniert.
 */
export class JunitReporter implements Reporter {
  constructor(private options: { outputFile?: string } = {}) {}

  async onEnd() {
    // Dieser Reporter ist absichtlich einfach gehalten.
    // Für produktiven Einsatz bitte Assertions, Fehler-Details und Timing ergänzen.
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const outputFile = this.options.outputFile || path.join(process.cwd(), 'test-results', 'junit.xml');
    await fs.ensureFile(outputFile);
    const xmlLine = `  <testcase classname="${test.titlePath().join(' > ')}" name="${result.title}" status="${result.status}" />\n`;
    await fs.appendFile(outputFile, xmlLine);
  }
}
