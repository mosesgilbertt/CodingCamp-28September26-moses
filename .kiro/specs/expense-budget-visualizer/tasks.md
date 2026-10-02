# Tasks — Expense & Budget Visualizer

Implementation tasks in dependency order. Each task maps to one or more requirements.

---

## Task 1 — Project Scaffold ✅

**Goal:** Create the directory structure and empty files so the browser can load the app.

Steps:
- [x] Create `index.html` at project root with correct `<!DOCTYPE html>` boilerplate
- [x] Create `css/style.css`
- [x] Create `js/app.js`
- [x] Link `css/style.css` in `<head>`
- [x] Load Chart.js from CDN (`https://cdn.jsdelivr.net/npm/chart.js`) before `app.js`
- [x] Link `js/app.js` as script before `</body>`

Covers: TC-1, TC-2 (structure), NFR-1

---

## Task 2 — HTML Markup ✅

**Goal:** Write all semantic HTML for every UI section.

Steps:
- [x] `<header>` with app title and dark-mode toggle button (`id="themeBtn"`)
- [x] Balance card: `<section class="balance">` containing `<strong id="total">`
- [x] Spending-limit warning element `<div id="limitWarning">` (hidden by default)
- [x] Pie chart section: `<canvas id="chart">` inside `.chart-box`
- [x] Input form `<form id="form">` with `id="name"`, `id="amount"`, `id="category"`
- [x] Per-field error spans: `<span id="nameError">`, `<span id="amountError">`, `<span id="categoryError">`
- [x] Sort `<select id="sort">` with five options (newest, oldest, high, low, category)
- [x] Spending-limit `<input id="limitInput" type="number">`
- [x] Transaction list `<ul id="list">` inside scrollable card
- [x] Empty-state paragraph `<p id="emptyState">`

Covers: FR-1, FR-2, FR-3, FR-4, OPT-1, OPT-2, OPT-3

---

## Task 3 — Base CSS (Light Mode) ✅

**Goal:** Style the app with CSS custom properties so it looks clean and readable in light mode.

Steps:
- [x] Define `:root` CSS variables (bg, surface, ink, muted, line, accent, danger, danger-bg)
- [x] Global reset: `box-sizing: border-box`, `font-family: system-ui`
- [x] Header: flex row, space-between
- [x] Balance card: large bold amount with accent colour; danger colour when over limit
- [x] Limit warning: danger-coloured text, hidden by default (`hidden` attribute)
- [x] Form: grid layout; inputs full-width with border and focus ring; submit button with accent colour
- [x] Per-field error spans with danger colour
- [x] Transaction list wrapper: `max-height: 320px; overflow-y: auto`
- [x] Transaction `<li>`: grid columns, amount right-aligned, delete button minimal
- [x] Empty state: centred muted text

Covers: NFR-1, NFR-2, NFR-3, NFR-4

---

## Task 4 — Responsive Layout ✅

**Goal:** Make the layout work well on both mobile and desktop.

Steps:
- [x] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present
- [x] Mobile-first base: all sections full-width, stacked vertically, max-width 520 px centred
- [x] Form fields stack vertically (grid layout)
- [x] Transaction list items readable at narrow widths (`overflow-wrap: anywhere`)

Covers: NFR-4

---

## Task 5 — Storage Layer (`js/app.js`) ✅

**Goal:** Implement all localStorage read/write helpers.

Steps:
- [x] `STORAGE_KEYS` constant object (`transactions`, `limit`, `theme`)
- [x] `loadTransactions()` — `JSON.parse(...) ?? []`
- [x] `saveTransactions(arr)` — `JSON.stringify` to localStorage
- [x] `loadLimit()` — returns parsed float or `null`
- [x] `saveLimit(val)` — stores value or removes key
- [x] `loadTheme()` — returns `'light'` or `'dark'` (default `'light'`)
- [x] `saveTheme(theme)` — stores string

Covers: FR-5, TC-2, OPT-2, OPT-3

---

## Task 6 — State & Add / Delete Logic ✅

**Goal:** Implement core transaction state and CRUD actions.

Steps:
- [x] `state` object: `{ transactions: [], spendingLimit: null, sort: 'newest' }`
- [x] `addTransaction(name, amount, category)`:
  - Builds object with `id`, `name`, `amount`, `category`, `timestamp`
  - Pushes to `state.transactions`, calls `saveTransactions()`, calls `renderAll()`
- [x] `deleteTransaction(id)`:
  - Filters `state.transactions`, calls `saveTransactions()`, calls `renderAll()`
- [x] On load: restores `state.transactions` and `state.spendingLimit` from localStorage

Covers: FR-2.3, FR-3.2, FR-5, TC-2

---

## Task 7 — Render: Balance ✅

**Goal:** Keep the balance display in sync with state.

Steps:
- [x] `renderBalance()` sums all transaction amounts
- [x] Formats with `toLocaleString('id-ID')` (Rupiah)
- [x] Updates `#total` text
- [x] Shows `#limitWarning` and applies `.over-limit` class when total ≥ spending limit
- [x] Clears warning when total < limit or no limit set

Covers: FR-3.1, FR-3.2, OPT-2

---

## Task 8 — Render: Pie Chart ✅

**Goal:** Render and update the Chart.js pie chart.

Steps:
- [x] `CATEGORY_COLORS` constant: `{ Food, Transport, Fun }`
- [x] `chartInstance` module-scoped variable, initialised to `null`
- [x] `renderChart()`:
  - Destroys existing instance before re-creating
  - Hides `<canvas>` and returns early when no transactions
  - Shows `<canvas>` and creates new `Chart` when data is present
  - Updates legend colour to match current theme

Covers: FR-4.1–FR-4.5

---

## Task 9 — Render: Transaction List ✅

**Goal:** Render the sorted transaction list with delete buttons.

Steps:
- [x] `getSortedTransactions()` handles: `newest`, `oldest`, `high`, `low`, `category`
- [x] `renderList()`:
  - Shows `#emptyState` and clears list when no transactions
  - Hides `#emptyState` when transactions exist
  - Renders each `<li>` with name, category, amount, and delete button
  - Delete button has `aria-label="Delete [name]"`
  - Per-item `.over` highlight when item amount exceeds limit (bonus visual cue)
  - Attaches delete click listener per item

Covers: FR-2.1–FR-2.5, OPT-1

---

## Task 10 — Form Validation & Submit ✅

**Goal:** Wire up the form with per-field validation and connect to `addTransaction`.

Steps:
- [x] `validateForm(name, amount, category)` returns `{ valid, errors }`
  - name: non-empty after trim
  - amount: parses as float > 0
  - category: non-empty string
- [x] `clearErrors()` clears all three error spans
- [x] On submit: reads fields, validates, shows per-field errors on failure, or adds transaction and resets form on success

Covers: FR-1.1–FR-1.4

---

## Task 11 — Sort Control (OPT-1) ✅

**Goal:** Let the user reorder the transaction list.

Steps:
- [x] `#sort` change event updates `state.sort` and calls `renderList()`
- [x] Five sort options: newest, oldest, high→low, low→high, category A-Z

Covers: OPT-1.1, OPT-1.2

---

## Task 12 — Spending Limit (OPT-2) ✅

**Goal:** Warn when total spending reaches or exceeds the limit.

Steps:
- [x] `#limitInput` input event parses value; calls `setSpendingLimit()` with float or `null`
- [x] `setSpendingLimit()` updates `state.spendingLimit`, persists via `saveLimit()`, re-renders balance and list
- [x] `renderBalance()` shows `#limitWarning` and `.over-limit` on `#total` when total ≥ limit
- [x] Warning clears when total drops below limit or limit is removed
- [x] On load: `#limitInput` is pre-populated with any persisted limit value

Covers: OPT-2.1–OPT-2.3

---

## Task 13 — Dark / Light Mode Toggle (OPT-3) ✅

**Goal:** Implement the theme toggle with persistence.

Steps:
- [x] `applyTheme(theme)` sets `data-theme` on `<html>`, updates button label, saves to localStorage, updates chart legend colour
- [x] `#themeBtn` click toggles between `'light'` and `'dark'`
- [x] On load: `applyTheme(loadTheme())` restores saved theme
- [x] `[data-theme="dark"]` CSS block overrides all custom properties

Covers: OPT-3.1–OPT-3.3

---

## Task 14 — Initialisation & Final Wiring ✅

**Goal:** Tie everything together in `init()`.

Steps:
- [x] `init()` called on `DOMContentLoaded`:
  1. `applyTheme(loadTheme())`
  2. `state.transactions = loadTransactions()`
  3. `state.spendingLimit = loadLimit()`
  4. Restores `#limitInput` value
  5. `renderAll()` — balance + chart + list
  6. `bindEvents()` — form submit, sort, limitInput, themeBtn
- [x] `renderAll()` calls `renderBalance()`, `renderChart()`, `renderList()` in order

Manual smoke-test checklist (verify in browser):
- [ ] Add a transaction → appears in list, balance updates, chart updates
- [ ] Delete a transaction → list shrinks, balance updates, chart updates
- [ ] Refresh page → all data restored correctly
- [ ] Submit empty form → per-field errors appear, no transaction added
- [ ] Sort dropdown → list reorders without data loss
- [ ] Set limit → warning appears on balance when total ≥ limit, clears when not
- [ ] Theme toggle → dark/light switches, persists on reload
- [ ] Works on mobile viewport

Covers: all requirements
