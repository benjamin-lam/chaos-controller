# 🤖 Playwright Code Auto-Pilot Prompt

This guide documents the auto-pilot workflow for Playwright test reviews, including automatic fixes, suggested improvements, and human-in-the-loop checks. Use this prompt when you want a structured Playwright code audit that distinguishes between automated adjustments and decisions requiring manual approval.

## Processing Protocol

The process runs in three phases:

1. **Automatic fixes** – Resolve syntax errors, typos, formatting, missing or incorrect imports, and update Playwright APIs where needed.
2. **Semi-automatic suggestions** – Propose structural, performance, and best-practice improvements.
3. **Human-in-the-loop items** – Call out business logic, security-sensitive, configuration, or architectural decisions that require manual validation.

## Output Template

For each file under review, use the following structure:

```
### 📄 DATEI: {{filename}}
```typescript
// [ORIGINAL CODE]
{{original_code}}
```

### 🔍 ANALYSE:
```
[AUTO FIXED] {{was wurde automatisch korrigiert}}
[SUGGESTION] {{Vorschlag mit Begründung}}
[HUMAN NEEDED] {{was benötigt menschliche Entscheidung}}
```

### ✨ KORRIGIERTER CODE:
```typescript
// [AUTO-CORRECTED VERSION]
{{korrigierter_code}}

// [COMMENTS WITH SUGGESTIONS]
// 💡 SUGGESTION: {{erklärter_vorschlag}}
// ❓ HUMAN: {{frage_für_human_input}}
```
```

Finish the report with a project-wide summary that lists auto-fixes, suggestions, and items needing human review:

```
## 📊 GESAMTBERICHT
🏁 AUTO-PILOT EXECUTION REPORT
──────────────────────────────
📈 STATISTIK:
• Dateien verarbeitet: {{number}}
• Auto-Fixes: {{number}}
• Suggestions: {{number}}
• Human Decisions needed: {{number}}
• Estimated time saved: {{hours}}h

⚠️ KRITISCHE HUMAN-DECISIONS REQUIRED:
1. {{datei}}: {{problem}} → {{frage}}
2. {{datei}}: {{problem}} → {{frage}}

✅ AUTOMATICALLY RESOLVED:
1. {{datei}}: {{was}} → {{fix}}
2. {{datei}}: {{was}} → {{fix}}

📝 NÄCHSTE SCHRITTE:
1. Review Human-Required Sections
2. Test corrected code
3. Update credentials/secrets
4. Run validation suite
```

## Auto-Correction Rules

Follow these quick rules when proposing automatic fixes:

### Syntax and Typo Fixes

```typescript
// Original
improt { test } from '@playwright/test';
const page = awai page.goto('/');

// Auto-corrected
import { test } from '@playwright/test';
const page = await page.goto('/');
```

### Playwright API Updates

```typescript
// Veraltet
await page.waitForSelector('.btn');
await page.waitForNavigation();

// Aktualisiert
await page.locator('.btn').waitFor();
await page.waitForURL('**/dashboard');
```

### Type-Safety Improvements

```typescript
// Loose types
async function login(credentials: any) { ... }

// Improved
interface Credentials { email: string; password: string; }
async function login(credentials: Credentials) { ... }
```

### Resource Leak Prevention

```typescript
// Risky
const context = await browser.newContext();
const page = await context.newPage();
return page; // Context never closed!

// Auto-corrected
const context = await browser.newContext();
const page = await context.newPage();
// ⚠️ HUMAN: Context cleanup needed in fixture teardown
```

## Human-in-the-Loop Triggers

Flag the following scenarios for manual decisions:

- **Security sensitive**: hardcoded passwords or API keys should be replaced with environment variables.
- **Business logic**: unclear rules (e.g., role names or permissions) need confirmation.
- **Project configuration**: base URLs, timeouts, or environment-specific values require team input.
- **Architecture**: large structural choices such as page objects vs. component testing.

## Input Formatting

To run the auto-pilot, provide structured input that includes the project layout, package.json, critical files, and optional focus areas:

```
## 🏗️ PROJECT STRUCTURE
{{Projektstruktur als Text oder Tree}}

## 📦 PACKAGE.JSON
```json
{{package.json Inhalt}}
```

## 🔧 CRITICAL FILES FOR REVIEW:

### FILE 1: {{path/to/file1.ts}}
```typescript
{{Vollständiger Code von file1}}
```

### FILE 2: {{path/to/file2.ts}}
```typescript
{{Vollständiger Code von file2}}
```

### FILE 3: {{path/to/file3.ts}}
```typescript
{{Vollständiger Code von file3}}
```

## 🎯 FOCUS AREAS (Optional):
- [ ] Security Issues
- [ ] Performance Problems
- [ ] Flaky Test Patterns
- [ ] CI/CD Compatibility
- [ ] Type Safety
```

This prompt can be copy-pasted to quickly trigger the Playwright auto-pilot review for the "test-finds-a-way" platform.
