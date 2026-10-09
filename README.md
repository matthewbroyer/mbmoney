# mbmoney.online

A free net worth and budget tracker. One HTML file. No accounts, no analytics, no servers. Your data stays in your browser and moves in and out as one CSV.

Live site: https://mbmoney.online

The app is `index.html`. Tabs: Dashboard, Transactions, Budget, Subscriptions, Plan (cash-flow calendar, savings goals, debt payoff), Charts, What If?, Achievements and Settings. It is also an installable web app (PWA): `manifest.json`, `sw.js` and the icon and social-image PNGs sit next to it. The service worker caches only the app's own files so it can open offline; it never touches your data. See `DEPLOY.md`, `LICENSE` (all rights reserved) and `ATTRIBUTIONS.md`. New in BETA 4.5: a refreshed gradient look and logo, a 2-minute snapshot for first-time setup, a Simple Dashboard view, a monthly check-in calendar reminder (.ics) and a year-end summary CSV (both under Settings, Your data).
