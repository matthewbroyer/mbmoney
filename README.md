# mbmoney.online

A free net worth and budget tracker. One HTML file. No accounts, no analytics, no servers. Your data stays in your browser and moves in and out as one CSV.

Live site: https://mbmoney.online

The app is `index.html`. Sections, in the left sidebar (a slim rail on tablets, a bottom bar on phones): Dashboard, Transactions, Budget, Subscriptions, Plan (cash-flow calendar, savings goals, debt payoff), Charts, What If?, Achievements and Settings. It is also an installable web app (PWA): `manifest.json`, `sw.js` and the icon and social-image PNGs sit next to it, with `robots.txt`, `sitemap.xml` and `CNAME` for hosting. The service worker caches only the app's own files so it can open offline; it never touches your data. See `DEPLOY.md` (one-time hosting setup), `DEPLOYMENT.md` (each release) and `ATTRIBUTIONS.md`. All rights reserved; there is no open-source license. New in BETA 4.7 (MB Suite v3): left sidebar navigation, `Money | Page` browser tab titles, a logo that always returns to the Dashboard, new icons and coin-and-sprout art, share images made on your device (dollar amounts hidden by default), and an Install card in Settings. See `OPTIMIZATION-REPORT.md`.
