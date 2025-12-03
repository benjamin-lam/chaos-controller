import { Reporter, FullConfig, Suite } from '@playwright/test';
import path from 'path';
import fs from 'fs-extra';

/**
 * Einfacher HTML-Reporter, der Playwrights eingebaute HTML-Ausgabe kopiert.
 * Kann als Basis für eigene Corporate-Design-Anpassungen dienen.
 */
export class HtmlReporter implements Reporter {
  constructor(private options: { outputFolder?: string } = {}) {}

  async onEnd(result: { status: string }, config: FullConfig, suite: Suite) {
    const outputFolder = this.options.outputFolder || path.join(process.cwd(), 'test-results', 'html');
    await fs.ensureDir(outputFolder);
    await fs.writeJson(path.join(outputFolder, 'summary.json'), {
      status: result.status,
      projectNames: config.projects.map((p) => p.name),
      totalTests: suite.allTests().length
    }, { spaces: 2 });
  }
}
