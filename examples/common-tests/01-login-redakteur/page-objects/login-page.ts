/**
 * 📄 PAGE OBJECT EXAMPLE
 * Zeigt Pattern für Page Objects
 * ABLEGEN UNTER: /pages/login.page.ts
 */

export class LoginPage {
  constructor(private page: any) {}

  // ⚠️ BITTE ANPASSEN: Diese Selectors an dein Formular anpassen
  private selectors = {
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '.error-message'
  };

  async navigateToLogin() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill(this.selectors.emailInput, email);
    await this.page.fill(this.selectors.passwordInput, password);
    await this.page.click(this.selectors.submitButton);
  }

  async getErrorMessage() {
    return await this.page.textContent(this.selectors.errorMessage);
  }
}
