import { globalSetup as coreGlobalSetup } from '@test-platform/core';

/**
 * 🌐 Verwendet das gemeinsame Global-Setup aus dem Core-Paket.
 * BITTE PRÜFEN: Passe Login-Selektoren und Pfade über .env an (LOGIN_PATH,
 * EMAIL_SELECTOR, PASSWORD_SELECTOR, SUBMIT_SELECTOR, DASHBOARD_SELECTOR).
 */
export default coreGlobalSetup;
