# 🧪 PHP Playwright Test Server

Kontrollierte PHP Test-Webseite für Playwright-E2E-Szenarien. Bietet vorhersehbare Responses, verzögerbare Antworten und data-testid-Selectoren für stabile Tests.

## 🚀 Schnellstart

```bash
cd examples/php-test-server
php -S localhost:8080 router.php
open http://localhost:8080
```

## 📁 Struktur
```
public/
  index.php        # Landingpage mit Fehler- und Delay-Simulation
  login.php        # Login-Flow
  dashboard.php    # Auth-geschützte Seite
  forms/           # Formulare für Validierung & Upload
  api/             # JSON Endpoints (auth, users, data)
config/            # Pseudo-Datenbank & Routing
utils/             # Helper (Session, Validator, Responses)
logs/              # Request-Logs & Uploads
```

## 🔑 Features
- Kontrollierte Delays via `?delay=ms`
- Fehler-Simulation via `?error=404|500|timeout`
- data-testid Attribute und ARIA Labels für zuverlässige Selektoren
- Vorhersehbare API-Responses (Auth, Userliste, Postdaten)
- Session-Infos und Cookies sichtbar auf den Seiten

## 🔥 Nützliche Routen
- `/login.php` mit Test-Usern: admin/admin123, editor/editor123, viewer/viewer123, test/test123
- `/dashboard.php` (erfordert Login)
- `/forms/registration.php`, `/forms/contact.php`, `/forms/upload.php`
- `/api/auth/login`, `/api/auth/status`, `/api/auth/logout`
- `/api/users` (Pagination via `page`, `per_page`)
- `/api/data?type=posts` oder `?error=500`

> Hinweis: Der mitgelieferte `router.php` spiegelt die `.htaccess`-Regeln und sorgt dafür, dass saubere URLs und `/api/*`-Routen auch mit dem PHP-Built-in-Server funktionieren.

## 🧪 Tests
Führe einfache Smoke-Tests der Endpoints aus:
```bash
php tests/test-endpoints.php
```
