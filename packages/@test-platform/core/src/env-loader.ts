import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

export const EnvironmentStages = {
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  STAGING: 'staging',
  PRODUCTION: 'production'
} as const;

export type EnvironmentStage = (typeof EnvironmentStages)[keyof typeof EnvironmentStages];

const toBoolean = (value: unknown): boolean => {
  if (value === undefined) return false;
  const normalized = String(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

const BaseEnvSchema = z.object({
  NODE_ENV: z.nativeEnum(EnvironmentStages),
  BASE_URL: z.string().url({ message: 'BASE_URL muss eine gültige URL sein' }),
  LOGIN_PATH: z.string().default('/login'),
  DASHBOARD_PATH_MATCHER: z.string().default('/dashboard'),
  DASHBOARD_SELECTOR: z.string().default('.dashboard-container'),
  EMAIL_SELECTOR: z.string().default('input[type="email"]'),
  PASSWORD_SELECTOR: z.string().default('input[type="password"]'),
  SUBMIT_SELECTOR: z.string().default('button[type="submit"]'),
  HEADLESS: z.string().transform(toBoolean).default('true'),
  TEST_SUITE: z.string().default('regression'),
  TEST_TAG: z.string().optional(),
  ENABLE_SCREENSHOTS: z.string().transform(toBoolean).optional(),
  ENABLE_TRACES: z.string().transform(toBoolean).optional(),
  NAVIGATION_TIMEOUT: z.string().transform((val) => Number(val)).optional(),
  ACTION_TIMEOUT: z.string().transform((val) => Number(val)).optional(),
  STORAGE_STATE: z.string().default('playwright/.auth/default.json'),
  ADMIN_STORAGE_STATE: z.string().default('playwright/.auth/admin.json'),
  EDITOR_STORAGE_STATE: z.string().default('playwright/.auth/editor.json'),
  VIEWER_STORAGE_STATE: z.string().default('playwright/.auth/viewer.json')
});

const RequiredSecretsSchema = z.object({
  ADMIN_EMAIL: z.string({ required_error: 'ADMIN_EMAIL fehlt' }).email(),
  ADMIN_PASSWORD: z.string({ required_error: 'ADMIN_PASSWORD fehlt' }).min(8),
  EDITOR_EMAIL: z.string({ required_error: 'EDITOR_EMAIL fehlt' }).email(),
  EDITOR_PASSWORD: z.string({ required_error: 'EDITOR_PASSWORD fehlt' }).min(8),
  VIEWER_EMAIL: z.string().email().optional(),
  VIEWER_PASSWORD: z.string().min(8).optional()
});

const StageSchemaOverrides: Partial<Record<EnvironmentStage, z.ZodObject<any>>> = {
  [EnvironmentStages.DEVELOPMENT]: RequiredSecretsSchema.extend({
    MOCK_API: z.string().transform(toBoolean).default('true'),
    FEATURE_FLAG: z.string().optional()
  }),
  [EnvironmentStages.TESTING]: RequiredSecretsSchema.extend({
    MOCK_API: z.string().transform(toBoolean).default('true')
  }),
  [EnvironmentStages.STAGING]: RequiredSecretsSchema,
  [EnvironmentStages.PRODUCTION]: RequiredSecretsSchema.extend({
    SENTRY_DSN: z.string({ required_error: 'SENTRY_DSN fehlt' }).url(),
    ALLOWED_ORIGINS: z.string({ required_error: 'ALLOWED_ORIGINS fehlt' })
  })
};

export type StageEnvironmentConfig = z.infer<typeof BaseEnvSchema> & z.infer<typeof RequiredSecretsSchema>;

function buildSchema(stage: EnvironmentStage) {
  const override = StageSchemaOverrides[stage];
  return override ? BaseEnvSchema.merge(override) : BaseEnvSchema.merge(RequiredSecretsSchema);
}

function formatIssues(errors: z.ZodIssue[]) {
  return errors
    .map((issue) => {
      const variable = issue.path.join('.');
      const secretHint = variable.includes('PASSWORD') || variable.includes('EMAIL') ? ' 🔐' : '';
      return `- ${variable}: ${issue.message}${secretHint}`;
    })
    .join('\n');
}

export interface LoadEnvStageOptions {
  stage?: EnvironmentStage;
  envFile?: string;
  schema?: z.ZodObject<any>;
  requireFile?: boolean;
}

export function loadEnvForStage(options?: LoadEnvStageOptions) {
  const stage = options?.stage ?? ((process.env.NODE_ENV as EnvironmentStage) || EnvironmentStages.DEVELOPMENT);
  const envFile = options?.envFile ?? `.env.${stage}`;
  const envPath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(envPath)) {
    const message = `❌ Stage-spezifische .env Datei fehlt: ${envFile}. Bitte erstelle sie basierend auf .env.example.${stage}.`;
    if (options?.requireFile !== false) {
      throw new Error(message);
    }
    console.warn(`⚠️ ${message}`);
  }

  dotenv.config({ path: envPath });

  const schema = options?.schema ? buildSchema(stage).merge(options.schema) : buildSchema(stage);
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const issues = formatIssues(parsed.error.issues);
    throw new Error(`❌ Environment Validation fehlgeschlagen für Stage "${stage}":\n${issues}`);
  }

  return parsed.data as StageEnvironmentConfig;
}

/**
 * Kompatibilitätswrapper für bestehende Aufrufe. Bevorzugt loadEnvForStage direkt nutzen.
 */
export const loadAndValidateEnv = (options?: LoadEnvStageOptions) => loadEnvForStage(options);
