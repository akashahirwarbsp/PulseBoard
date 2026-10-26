# Contributing to PulseBoard

Thanks for considering a contribution!

## Before you start

- Search existing issues and pull requests before opening a new one.
- For a substantial change, open an issue first so the scope can be discussed.
- Keep demo content fictional. Do not add real users' personal information, credentials, tokens, or private analytics.
- Keep the project lightweight and dependency-free unless there is a clear reason to add a dependency.

## Development setup

1. Install Node.js 20 or later.
2. Clone the repository.
3. Run `npm test` before submitting a change.
4. Run `npm run serve` and check the interface at desktop and mobile widths.

No dependency installation is required.

## Pull request checklist

- [ ] The change solves one clear problem or adds a focused feature.
- [ ] The interface remains usable on small screens.
- [ ] Keyboard focus and accessible labels are preserved where relevant.
- [ ] Tests are added or updated for changed utility behavior.
- [ ] `npm test` passes.
- [ ] Documentation is updated when behavior or setup changes.
- [ ] No secrets, real personal data, or unsupported claims are included.

## Style

Use readable modern JavaScript, descriptive names, small functions, and semantic HTML. Prefer built-in browser and Node APIs over new dependencies. Please do not commit generated build output or local environment files.
