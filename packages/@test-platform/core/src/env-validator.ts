import { z } from 'zod';
import {
  EnvironmentStages,
  type LoadEnvStageOptions,
  type StageEnvironmentConfig,
  loadEnvForStage
} from './env-loader';

/**
 * 🛡️ Abwärtskompatibler Wrapper für die neue Stage-basierte Env-Ladung.
 * Nutze bevorzugt `loadEnvForStage` direkt, um Stages klar zu steuern.
 */
export type BaseEnvironmentConfig = StageEnvironmentConfig;

export interface LoadEnvOptions<T extends z.ZodRawShape> extends LoadEnvStageOptions {
  schema?: z.ZodObject<T>;
}

export function loadAndValidateEnv<T extends z.ZodRawShape>(options?: LoadEnvOptions<T>) {
  return loadEnvForStage(options);
}

export { EnvironmentStages, loadEnvForStage };
