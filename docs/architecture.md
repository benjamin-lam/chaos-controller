# Architektur

```
Shared Infrastructure (30%)          Custom Tests (70%)
├── Test Runner Config              ├── Page Objects
├── CI/CD Pipelines                ├── Test Cases
├── Utility Functions              ├── Selectors
├── Reporting Setup                ├── Business Logic
└── Quality Gates                  └── Test Data
```

- Gemeinsame Pakete liegen unter `packages/@test-platform/*`.
- Templates befinden sich in `templates/` und können über das Bootstrap-Skript kopiert werden.
- Beispiele liegen in `examples/` und sind als Blaupausen gedacht.
