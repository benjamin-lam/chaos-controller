// scanner/crawler.config.ts

export type RoleType = 'public' | 'login';

export type LoginStepAction = 'goto' | 'fill' | 'click' | 'waitForURL';

export interface LoginStep {
  action: LoginStepAction;
  url?: string;
  selector?: string;
  valueKey?: string;
  pattern?: string;
}

export interface LoginConfig {
  loginPath: string;
  credentials: Record<string, string>;
  steps: LoginStep[];
}

export interface CrawlConfig {
  startPaths: string[];
  includePatterns?: RegExp[];
  excludePatterns?: RegExp[];
  maxPages?: number;
  maxDepth?: number;
}

export interface RoleConfig {
  name: string;
  type: RoleType;
  /**
   * Optional: existierender Playwright Storage State
   * z.B. per Login-Vorbereitungs-Task erzeugt.
   */
  storageStateFile?: string;
  /**
   * Login-Konfiguration, falls kein Storage-State genutzt wird.
   */
  login?: LoginConfig;
  /**
   * Crawl-Einstellungen für diese Rolle.
   */
  crawl: CrawlConfig;
}

export interface ComponentPattern {
  name: string;
  selectors?: string[];
  classNameRegex?: RegExp;
  special?: 'login' | 'hero' | 'slider' | 'custom';
}

export interface ProjectVocabulary {
  components: ComponentPattern[];
}

export interface ScannerConfig {
  baseUrl: string;
  /**
   * Optional: globale kleine Pause zwischen Requests (ms),
   * um Server nicht zu stressen.
   */
  requestDelayMs?: number;
  roles: RoleConfig[];
  vocabulary: ProjectVocabulary;
}

export interface PageComponentSummary {
  role: string;
  url: string;
  title: string | null;
  status: number;
  depth: number;
  components: Record<string, number>;
  error?: string;
}

export interface ScanResult {
  config: ScannerConfig;
  generatedAt: string;
  pages: PageComponentSummary[];
}

