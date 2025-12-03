# Fixture Pattern

- Lege wiederverwendbare Fixtures in `fixtures/` ab.
- **BITTE ANPASSEN:** Fixtures auf eure Auth-/Daten-Modelle mappen.

```ts
export const test = base.extend<{ authToken: string }>({
  authToken: async ({ request }, use) => {
    const token = await request.post('/api/login');
    await use(token);
  }
});
```
