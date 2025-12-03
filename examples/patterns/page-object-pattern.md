# Page Object Pattern

- Halte Selektoren in dedizierten Klassen.
- **BITTE ANPASSEN:** Dateipfade/Namespaces für euer Projekt.

```ts
class DashboardPage {
  private selectors = {
    profileMenu: '[data-testid="profile-menu"]'
  };

  constructor(private page: Page) {}

  async openProfile() {
    await this.page.click(this.selectors.profileMenu);
  }
}
```
