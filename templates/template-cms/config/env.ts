import { loadEnvForStage } from '@test-platform/core';

/**
 * 🌱 Lädt und validiert Umgebungsvariablen für das CMS-Template inklusive Stage-Unterstützung.
 * BITTE ANPASSEN: Hinterlege stage-spezifische .env Dateien (.env.development, .env.staging, .env.production).
 */
export const env = loadEnvForStage();
