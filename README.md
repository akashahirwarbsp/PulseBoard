# PulseBoard

**A clean, responsive social media analytics dashboard demo built with HTML, CSS, and vanilla JavaScript.**

PulseBoard brings a familiar analytics-workspace experience to a small, dependency-free front-end project. Explore sample channel metrics, search a content library, review campaign progress, inspect illustrative audience insights, switch themes, and export records as CSV.

> **Demo data notice:** Every account, profile, statistic, post, campaign, budget, and audience insight in this project is fictional sample data. PulseBoard does not connect to Instagram, TikTok, YouTube, X, advertising platforms, or any real account. It does not publish content or collect personal information.

## Features

- **Overview dashboard** with KPI cards, an interactive sample performance chart, channel breakdown, and top-performing sample posts.
- **Channel filtering** for Instagram, TikTok, YouTube, X, or all channels.
- **Reporting-period selector** for 7, 30, and 90 day chart views.
- **Content library** with search, platform filters, post status tabs, and sample reach/engagement metrics.
- **Campaign view** with illustrative budgets, status labels, and progress bars.
- **Audience view** with example age-range and location distributions.
- **CSV export** for visible content records and sample campaigns.
- **Display settings** with dark mode and compact-table preferences saved locally in the browser.
- **Responsive layout** for desktop, tablet, and mobile screens.
- **Accessible interaction basics**, including keyboard focus styles, button labels, and a live region for toast feedback.
- **No frontend dependencies, API keys, database, or build step required.**
- **Node.js unit tests** for formatting, CSV escaping, and content filtering.

## Preview

The self-contained UI has no remote images or font downloads. Because browser security rules can block JavaScript modules opened through `file://`, the local server in Option B is the recommended way to run the complete demo.

## Quick start

### Option A — Open directly

1. Download or clone the repository.
2. Open the `index.html` file to inspect the page markup, or continue with Option B to run all interactions reliably.
3. Use the left navigation and filters to explore the demo.

### Option B — Run the local server

Requires Node.js 20 or later. No `npm install` is required.

```bash
git clone https://github.com/YOUR_USERNAME/pulseboard.git
cd pulseboard
npm run serve
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). Stop the server with `Ctrl+C`.

To use another port:

```bash
PORT=8080 npm run serve
```

On Windows PowerShell:

```powershell
$env:PORT=8080
npm run serve
```

## Run the tests

Requires Node.js 20 or later.

```bash
npm test
```

The test suite uses Node's built-in test runner, so installing test packages is not necessary.

## Publish with GitHub Pages

This is a static front-end project and can be published with GitHub Pages:

1. Create a public repository named `pulseboard` on GitHub.
2. Upload or push the project files to the repository root. Keep `index.html` at the root.
3. Open **Settings → Pages** in the repository.
4. Under the build and deployment settings, choose **Deploy from a branch**, select your default branch (usually `main`), and choose **/(root)**.
5. Save the settings and use the published URL shown by GitHub Pages after deployment finishes.

The optional Node server is for local development only; GitHub Pages serves the static files directly.

## Project structure

```text
pulseboard/
├── .github/
│   └── workflows/
│       └── ci.yml          # Runs unit tests on pushes and pull requests
├── scripts/
│   └── serve.mjs           # Tiny dependency-free local static server
├── src/
│   ├── css/
│   │   └── styles.css      # Layout, components, responsive and dark styles
│   ├── js/
│   │   ├── app.js          # UI state, navigation, rendering, and exports
│   │   ├── data.js         # Synthetic demo records and metrics
│   │   └── utils.js        # Reusable formatting, CSV, and filter helpers
│   └── favicon.svg
├── tests/
│   └── utils.test.js       # Node test-runner unit tests
├── index.html
├── package.json
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
└── README.md
```

## Data and privacy

- All demo records live in `src/js/data.js` and are bundled with the project.
- There are no analytics trackers, external API requests, sign-in forms, or server-side database calls.
- Dark mode and compact-table preferences may be stored in the current browser's `localStorage`.
- CSV exports are created locally in the browser and downloaded to your device.
- The optional development server listens on `127.0.0.1` by default and serves files from the project directory.

## Customization ideas

- Replace the synthetic records in `src/js/data.js` with data from a source you are authorized to use.
- Add a backend and authentication before introducing private or multi-user data.
- Connect platform APIs only after reviewing their current developer rules, permissions, rate limits, and data policies.
- Add integration and browser tests if this demo evolves into a production product.

Any real integration should make clear which metrics are measured, how each metric is calculated, and when data was last refreshed.

## Technology

- HTML5
- CSS3 (responsive layout; no CSS framework)
- JavaScript ES modules
- Node.js built-in HTTP server and test runner

## License

Released under the [MIT License](LICENSE). See the license file for details.

---

Made as an open-source learning and portfolio project. Contributions and suggestions are welcome.
