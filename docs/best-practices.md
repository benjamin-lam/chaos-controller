# 📋 BEST PRACTICES

## 1. TEST ORGANISATION
```
tests/
├── auth/                    # Alles zur Authentifizierung
│   ├── login.spec.ts       # Login Tests
│   └── logout.spec.ts      # Logout Tests
├── checkout/               # Checkout Prozess
│   ├── cart.spec.ts
│   └── payment.spec.ts
└── admin/                  # Admin Bereich
    └── user-management.spec.ts
```

## 2. PAGE OBJECT PATTERN
```typescript
// ❌ SCHLECHT: Selectors im Test
await page.click('button.submit');

// ✅ GUT: Page Object verwenden
class LoginPage {
  private selectors = { submit: 'button.submit' };
  async submit() { await this.page.click(this.selectors.submit); }
}
```

## 3. UMWELTVARIABLEN
```bash
# .env Datei
BASE_URL=https://staging.example.com
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=secret123
```

## 4. SELECTOR STRATEGIEN
```typescript
// ✅ PRIORITÄT:
1. data-testid="login-button"      # Beste Option
2. role="button"                   # Accessibility-first
3. .login-button                   # CSS Class
4. #loginButton                    # ID (wenn stabil)
5. //button[text()='Login']        # Text (vorsichtig!)
```

## 5. TEST DATA MANAGEMENT
```typescript
// Test Data Factory Pattern
class UserFactory {
  static createEditor() {
    return { email: `editor-${Date.now()}@test.com`, role: 'editor' };
  }
}
```

## 🚨 ANTI-PATTERNS ZU VERMEIDEN

1. ❌ Hardcoded Credentials im Code
2. ❌ Übermäßige Sleeps (`page.waitForTimeout(5000)`)
3. ❌ Zu generische Tests ("prüft alles")
4. ❌ Tests voneinander abhängig machen
5. ❌ Keine Screenshots/Traces bei Fehlern
