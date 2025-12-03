// 📏 Beispiel ESLint Konfiguration (BITTE projektspezifisch anpassen)
export default {
  ignores: ['dist', 'node_modules'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'prefer-const': 'warn'
  }
};
