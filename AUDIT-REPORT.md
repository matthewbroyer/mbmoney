# mbmoney.online 4.0 Web Edition: Legal-Risk, Privacy, Security, Accessibility and Abuse Audit

Audit date: September 20, 2026 (addenda: October 9, 2026). Scope: the single file `index.html` (all code, styles, text and artwork are inline). Formerly "Personal Wealth Management Tool".
This is a good-faith engineering review, not legal advice. Nothing here says the app is "legally compliant" or "lawsuit-proof". No lawyer has reviewed the Terms or Privacy text; they are written as carefully as I can and kept short and plain.

## 1. What the app is

| Question | Answer (verified in code) |
|---|---|
| What it does | Personal budget, transaction and net worth tracker with charts, forecasts and gamified achievements |
| Who uses it | Adults tracking their own money |
| What users enter | Optional name, date of birth, income figures, account balances, credit score, notes, transactions |
| Backend / database / accounts / payments / subscriptions | None |
| File uploads | Only a user-chosen CSV, read in the browser and never uploaded |
| User-to-user content, email, SMS, location | None |
| Data storage | Browser localStorage: `pwmt.web.v1` (data; key name kept so existing users keep their data), `pwmt.theme`, `pwmt.notice`. No cookies, sessionStorage or IndexedDB (checked in a live run) |
| Network requests while running | None to other sites (checked with request logging across every page; `connect-src 'none'` in the CSP). Since BETA 4.3 the page also loads its own manifest, icons and service worker from the same origin |
| Hosting | GitHub Pages, domain registered and managed at Namecheap. No logs kept by the owner; the Privacy text says so and names both providers |
| Sensitive data possible | Yes, financial figures. Card, SSN, password and account numbers are discouraged and partly blocked |

## 2. Third-party inventory

| Item | Result |
|---|---|
| JavaScript libraries | None. Charts, confetti, search, CSV parsing and the UI are custom code |
| Fonts | None loaded. System font stack only |
| Images / icons / logo / favicon | None external. Logo, favicon and all 112 badge graphics are inline SVG drawn for this project. Since BETA 4.3 there are also five PNGs rendered from that logo (app icons and the social preview image), served from the same origin |
| Analytics, ads, error reporting, CDNs, maps, AI APIs, payment processors | None |
| External URLs in the file | The `w3.org/2000/svg` namespace string (not a request), and one outbound link to https://www.bogleheads.org/ (opens in a new tab, `noopener noreferrer`, only when clicked) |
| Test-only tools, not shipped | Playwright (Apache-2.0), axe-core (MPL-2.0) |

Result: no license obligations. Attribution and trademark notes are in `ATTRIBUTIONS.md`.

## 3. Findings and what was done

| Issue | Found? | Severity | What could happen | What was done | Remaining action |
|---|---|---|---|---|---|
| No privacy policy | Yes | MEDIUM | Users could not see what is stored or where | Added a short in-app Privacy policy written from the actual code (storage keys, no network, GitHub Pages and Namecheap hosting, no owner logs, deletion, children). Linked from footer, storage notice and site search | None |
| Terms lacked misuse, sensitive-data and non-affiliation language | Yes | LOW | Ambiguity about acceptable use | Rewrote Terms (9 short clauses): adults, lawful personal use, no sensitive numbers, no probing, non-affiliation, calculations explained in FAQ | Optional attorney review if the app grows (R2) |
| Injection via imported CSV or storage (XSS, HTML injection) | Tested | LOW (no issue found) | Script execution from a crafted file | No `innerHTML`, `eval`, `document.write` or dynamic script. Tested 7 payloads in name, description, category, notes and row names across every page, search and dialogs: all inert text | None |
| Prototype pollution / crash via crafted CSV (`constructor`, `__proto__` as category names) | Yes | MEDIUM | A crafted file crashed the importer | Fixed with own-property checks; tested, `Object.prototype` untouched | None |
| Damaged or hand-edited saved data bricks the app | Yes | MEDIUM | Wrong types in storage broke every page | State is rebuilt field by field on load (types, ranges, lengths, unique IDs). Tested with garbage, arrays, null, wrong types and 50,000 rows | None |
| CSV formula injection when exporting | Already handled | LOW | `=HYPERLINK(...)` in a description could run in Excel | Confirmed export prefixes risky cells; fixed a gap for tab-leading text; round trip tested | None |
| No limits on imported files | Yes | MEDIUM | A huge file could freeze the tab | 10 MB and 200,000-row caps with plain messages | None |
| No Content Security Policy | Yes | MEDIUM | If any XSS existed, injected scripts could run or send data out | CSP meta tag: only the file's own inline scripts run (by hash), `connect-src 'none'`, no frames, objects, workers, forms or base URI. Verified: app works, injected script blocked | None (see section 6) |
| Referrer leakage | Yes | LOW | Page URL could reach sites the user leaves to | `referrer: no-referrer` meta tag | None |
| Framing (clickjacking) | Yes | LOW | The page could be embedded in another site to trick clicks | GitHub Pages cannot send `frame-ancestors`. Added a small in-file frame guard: if the page detects it is inside a frame, it hides the app and shows an "Open mbmoney.online" link. Tested in an iframe | The guard also blocks embedding on your own site. Tell me if you want an embed exception |
| Test hook `?today=` changed the app date on any origin | Yes | LOW | A crafted link could push bogus dates into a session | Hook now works only on `file:` and `localhost` | None |
| Raw error text shown to users | Yes | LOW | Internal error text in the UI | Fixed plain messages only; no console logging remains | None |
| Users could store card or SSN numbers | Yes | MEDIUM | Sensitive data at rest in plain localStorage | Warning on the Add form; card (Luhn-checked) and SSN patterns are blocked in descriptions, notes, name and rename fields, and replaced with `[removed]` on import and paste, with a notice | Cannot catch every format (R6) |
| Sensitive info notice | Yes | LOW | Users might enter passwords or account numbers | Notice on Add form, in Terms and in Privacy | None |
| Accessibility failures | Yes | MEDIUM | Unlabeled table inputs, no page heading, no skip link, invalid tab ARIA, light-mode contrast misses, small checkboxes, a 320px overflow, section jumps hidden under the sticky header | Fixed all. Final axe-core scan (WCAG 2.0/2.1/2.2 A and AA plus best practices): 0 violations on all 7 pages, dark and light, 1280 and 390px, with a dialog and search open, and on fresh pages at 320px | Manual screen reader test (R5) |
| Tab bar could not scroll back on narrow screens | Reported | LOW | Menu unusable | Added arrow buttons, wheel and drag scrolling, and stopped edge-swipe capture. I could not reproduce the exact failure | Confirm on your phone |
| Real brand names in demo data | Yes | LOW | Could read as implied endorsement | Replaced with generic names | None |
| Product name | Resolved | LOW | The old name used "wealth management", language regulated firms use, and "PWMT" was not cleared | Renamed to mbmoney.online (your own domain and initials). The app makes no advice or advisory claims | Optional: a quick search of the USPTO database for "mbmoney" (R3) |
| `Bogleheads®` mark | Verified | LOW | Using the mark could imply affiliation | Research shows BOGLEHEADS is a registered trademark of The John C. Bogle Center for Financial Literacy (Justia listing, registration 4036654, renewed 2021), so the ® is correct. Added an attribution and a non-affiliation sentence in About, a link to bogleheads.org, and a note in `ATTRIBUTIONS.md` | Confirm status at USPTO if you want certainty (R3). My source is a third-party listing |
| Children / teens | Flag | MEDIUM | Gamified visuals could appeal to minors | App collects no data; Privacy and Terms say it is for adults | Optional human review of the age wording (R2) |
| Disclaimers | Partly | LOW | Users relying on forecasts | Added a note under Dashboard Forecast; What If and Terms carry one | None |
| Accuracy of financial claims | Reviewed | LOW | Over-promising | No "secure", "guaranteed" or compliance claims. Storage and network statements are backed by tests | None |
| Local storage is not encrypted | Yes | LOW | Anyone using the same browser profile can read the data | Stated in the Privacy policy | Optional future idea (R7) |
| Contact details | Resolved | LOW | Terms and Privacy pointed to contact details that did not exist | Removed the contact clause and the "Questions?" line. The app collects nothing, so no contact point is required | If a contact is ever needed, add it then |
| Public source repo (GitHub free plan) | Flag | LOW | Anyone can read and copy the code | Added an all-rights-reserved `LICENSE` that states viewing is not permission to copy | Cannot stop copying, only enforce afterward (for example a DMCA takedown) |
| Domain lapse | Flag | MEDIUM | If the domain expires, a new owner could serve a page at the same address that reads what visitors saved | Documented in `DEPLOY.md`: turn on Namecheap auto-renew and verify the domain in GitHub | You |

## 4. Data minimization review

| Field | Needed? | Decision |
|---|---|---|
| Name | No, greeting only | Kept, optional, never leaves the device |
| Date of birth | Only for the age-based milestone and age labels | Kept, optional, clearly labeled. A future option is asking only for birth year |
| Income, retirement income, balances, notes, transactions, credit score | Yes, core function | Kept, local only |
| Accounts, email, phone, location, IP logging, identifiers, analytics | Not used | None added |

## 5. Checks run

- Security: XSS payload import, prototype-name CSV, corrupt storage (6 cases), CSV formula round trip, oversize and row-cap files, card and SSN handling, no secrets or keys in the file, no `eval`/`innerHTML`, CSP block test, frame guard test. 26 security checks, all passing.
- Accessibility: axe-core matrix above, plus 22 keyboard and layout checks (skip link, focus rings, Data menu by keyboard, dialog labels and focus trap, Esc returns focus, one `h1`, page title updates, `aria-current`, 320px reflow, reduced motion). All passing.
- Rename: 12 checks (header, page title, footer, old name gone from the visible UI, Bogleheads link attributes, trademark notice, release notes keep old names, Privacy names GitHub and Namecheap, no contact wording, export filename, search finds the rename note, framed page refuses). All passing.
- Functional: earlier regression suites (page render, CSV round trip, functional flows, mobile overflow, site features, About tour, UX behaviors) rerun after the rename. All pass. Edge states (fresh data, zero income, blank birth date, leap day, year 1900 and 2999, zero and huge amounts) show no "NaN", "undefined" or "Infinity".
- Not done: I did not re-derive every financial formula against the original spreadsheet. Spot-check the forecast dates and milestones against your own numbers (R8).
- Not done: no real-device, screen reader (NVDA, JAWS, VoiceOver) or Safari and Firefox testing. All runs used headless Chromium.

## 6. Security headers on GitHub Pages

GitHub Pages does not let you set custom response headers, so headers cannot be added there. To keep the site maintenance-free, protections that can live in the file are in the file:

| Protection | How it is covered |
|---|---|
| Content-Security-Policy | Meta tag in the file (scripts by hash, no network, no frames, no forms). Since BETA 4.3 it also allows `worker-src 'self'` and `manifest-src 'self'` for the installable-app files. Covered |
| Referrer-Policy | Meta tag `no-referrer`. Covered |
| Clickjacking (`frame-ancestors`, `X-Frame-Options`) | Cannot be set by meta tag. Covered by the in-file frame guard instead. It stops the app running in a frame, but a header would be stronger |
| HTTPS / HSTS | Turn on **Enforce HTTPS** in repo Settings > Pages. GitHub decides its own HSTS header. I cannot confirm what it sends |
| X-Content-Type-Options, Permissions-Policy | Not settable. Low risk here: the app has no uploads, no sensor or camera use, and no user-served files |

I could not check what headers GitHub adds by default. After deploying, run `curl -sI https://mbmoney.online` to see them. If you ever want full header control, the low-effort option is a free proxy layer such as Cloudflare in front of GitHub Pages, but that adds a third party and ongoing settings, so I did not include it.

Other notes:

- The CSP allows scripts by hash. Do not add anything that rewrites the file (minifiers, injected snippets). GitHub Pages does not.
- No CORS, cookies or rate limiting are needed because there is no backend.
- GitHub's terms restrict Pages for commercial or sensitive-transaction sites. A free tool that collects nothing is not that, but keep it that way.

Addendum, October 9, 2026 (BETA 4.3, installable web app). This part was checked separately from the September audit:

- New files: `manifest.json`, `sw.js`, four icon PNGs and `og-image.png`. The service worker ignores every non-GET and cross-origin request, and caches only the app's own files. It never reads or caches data, which stays in localStorage. Delete-all-data does not need to touch it.
- CSP changes: `img-src 'self' data: blob:`, `worker-src 'self'`, `manifest-src 'self'`, and a new hash for the edited main script. All four inline script hashes were checked against the file. `connect-src 'none'` is unchanged.
- Tested in headless Chromium over localhost: manifest parses with no errors, Chromium reports no installability errors, the service worker activates and caches the shell, the app reloads offline, there are no console or page errors, and the Install card appears, calls the saved prompt, and goes away after the install event or in standalone mode.
- Not tested: the real browser install dialog (a synthetic event stood in for it), anything on a real iPhone or iPad (the iOS card was checked with an iPhone user agent only), Safari, Firefox, and a live run over the real https://mbmoney.online domain.
- Residual risk: the Home Screen app on iOS has storage separate from Safari. The Settings card and FAQ tell people to export first.

Addendum, October 9, 2026 (BETA 4.4, Plan tab, resilience strip and monthly review). Checked separately:

- New stored data: debt terms (APR, minimum, due day), savings goals and a pay schedule, all inside the same browser storage key and the same CSV and JSON backups. No new network requests, storage keys, libraries or files beyond `index.html`. Goal names pass through the same card and Social Security number check as other free text, and every value read back from storage or a file is validated field by field (`cleanState`, `importCSVText`).
- Tested in headless Chromium: the CSV, JSON and merge round trips return identical debts, goals and pay schedule; older CSV files without the new rows still import; damaged values are dropped; the payoff simulator matches the closed-form result for a single loan; the cash-flow projection matches a hand-calculated weekly and monthly scenario; every tab renders with no console or page errors; a phone-width layout has no sideways scroll.
- Not tested: real devices, screen readers, Safari, Firefox, an axe accessibility run on the new Plan tab, or the live site. The payoff and cash-flow figures are estimates from the user's own entries and are labeled as such in the app.

Addendum, October 9, 2026 (BETA 4.5, new look, 2-minute snapshot, Simple view, reminder, year-end summary). Checked separately:

- Changes are inside `index.html` plus regenerated images (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `og-image.png`, `favicon.svg`), `manifest.json` colors, and `sw.js` (`mbmoney-v3`). No new network requests, libraries, fonts, cookies or storage keys except one per-device display setting, `pwmt.simple`, which holds only 0 or 1. CSP is unchanged apart from the recomputed script hash.
- The calendar reminder and year-end summary are built in the browser and saved with a download link; nothing is uploaded. Free text that goes into the CSV (category and subscription names) is guarded against spreadsheet formula injection with the same `csvSafe` prefix as the existing export. The snapshot name field uses the same card and Social Security number check as other text, and amounts are validated as non-negative numbers before anything is saved.
- Tested in headless Chromium: snapshot save, invalid input and undo; status pill states for a new month, stale transactions and a caught-up month; logo click returns to the Dashboard; Simple view persists across reload; the .ics file has CRLF line endings, folded lines, a valid first date and a monthly rule; the year-end CSV totals match the app's own calculations; 121 achievements evaluate with the 9 new ones unlocking from the right data; CSV round trip is unchanged; the earlier Plan and install/offline tests still pass; every tab renders in light and dark at desktop and phone width with no console errors or sideways scroll.
- Not tested: opening the .ics in a real calendar app, real devices, Safari, Firefox, screen readers, an axe run on the new colors (white text on the gradient buttons and hero was checked by calculation, not with a tool), or the live site. The reviewed-month flags used by the Review achievements live in the JSON backup only, not the CSV, like the other flags.

## 7. Remaining risks and actions

| # | Action | Who |
|---|---|---|
| R1 | (Closed) Hosting and logs: GitHub Pages and Namecheap are named in the Privacy policy. Providers may keep their own logs, and the policy says so | Done |
| R2 | Optional: a lawyer review of the Terms (New Hampshire law and venue, liability limits, "adults" wording) if usage grows | You, later |
| R3 | Optional: search the USPTO database for "mbmoney" and confirm the BOGLEHEADS mark status | You |
| R4 | After deployment, load the live URL, open the console, and confirm no CSP errors. Run `curl -sI https://mbmoney.online` | You |
| R5 | Try the app with a screen reader and on a real phone | You |
| R6 | The sensitive-number filter is a safety net, not a guarantee | Ongoing |
| R7 | Optional: offer an encrypted export, or ask only for birth year | Future |
| R8 | Spot-check key formulas (savings rate, retirement and FI/RE dates, net worth) against your spreadsheet | You |
| R9 | (Closed) Contact link removed | Done |
| R10 | Turn on Namecheap auto-renew and verify the domain in GitHub (see `DEPLOY.md`) | You |

## 8. Final file check

| Item | Status |
|---|---|
| Privacy policy | Present, matches code |
| Terms of use | Present, matches app |
| Disclaimers | Present where forecasts appear |
| Unnecessary personal data | None collected (optional name and birth date stay on the device) |
| Secrets exposed | None |
| Input handled safely | Tested |
| External services documented | GitHub Pages and Namecheap (hosting and domain only) |
| Third-party licenses | None apply. Trademark attribution added |
| Assets checked | All original, inline |
| Accessibility reviewed | Automated and keyboard checks done, manual screen reader test outstanding |
| Clear data, export, import | Present (Data menu, Clear all data with confirmation, Undo) |
| Error messages safe | Yes |
| Unsupported legal or security claims | None found |
| Analytics, tracking, cookies, extra dependencies | None |
| Calculations tested | Edge cases tested; formula spot-check by you recommended |
| Facilitating illegal activity | No; Terms require lawful personal use |
