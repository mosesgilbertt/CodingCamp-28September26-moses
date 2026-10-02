# Design — Expense & Budget Visualizer

## Project Structure

```
CodingCamp-28September26-moses/
├── index.html          ← single HTML file, all markup
├── css/
│   └── style.css       ← all styles (light + dark mode, responsive)
└── js/
    └── app.js          ← all application logic
```

No build step. Open `index.html` directly in a browser.

---

## Architecture Overview

The app is a classic three-layer client-side app:

```
index.html  ──imports──▶  css/style.css
            ──imports──▶  Chart.js (CDN)
            ──imports──▶  js/app.js

js/app.js
  ├── Storage layer   — read/write localStorage
  ├── State           — in-memory array of transactions + limit + theme
  ├── Render layer    — DOM update functions (list, balance, chart)
  └── Event layer     — form submit, delete, sort, limit, theme toggle
```

All state lives in one JS module. Every user action calls `render()` which re-draws the affected parts of the DOM. There is no virtual DOM, no reactive framework — just plain function calls.

---

## Data Model

### Transaction object (stored in `localStorage` as JSON array)

```js
{
  id:        string,   // crypto.randomUUID() or Date.now().toString()
  name:      string,   // item name
  amount:    number,   // positive float
  category:  "Food" | "Transport" | "Fun",
  timestamp: number    // Date.now() at creation time
}
```

### localStorage keys

| Key                    | Value |
|------------------------|-------|
| `ebv_transactions`     | JSON array of Transaction objects |
| `ebv_spending_limit`   | number as string, or `""` if not set |
| `ebv_theme`            | `"light"` or `"dark"` |

---

## UI Layout

### Desktop (≥ 640 px)

```
┌─────────────────────────────────────────────────┐
│  💰 Expense & Budget Visualizer        [🌙 Dark] │  ← header
├────────────────────┬────────────────────────────┤
│                    │                            │
│   TOTAL BALANCE    │       PIE CHART            │
│   $ 0.00           │   (Chart.js canvas)        │
│   [⚠ Over limit]   │                            │
│                    │                            │
├────────────────────┴────────────────────────────┤
│                  ADD EXPENSE                     │
│  [Item Name______] [Amount___] [Category▼] [Add] │
│  [Set Limit: ____]  [Sort: Newest▼]             │
├─────────────────────────────────────────────────┤
│  TRANSACTIONS                                    │
│  ┌───────────────────────────────────────────┐  │
│  │  Coffee         $4.50    Food      [✕]    │  │
│  │  Bus ticket     $2.00    Transport [✕]    │  │
│  │  ...                                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Mobile (< 640 px)

All sections stack vertically: header → balance → chart → form controls → transaction list.

---

## Component Breakdown

### 1. Header

- App title on the left.
- Dark/Light mode toggle button on the right (OPT-3). Uses a sun/moon emoji or icon. Applies `data-theme="dark"` on `<html>` element.

### 2. Balance Card

- Large, prominent display of total amount.
- Sub-text showing number of transactions.
- Turns red / shows warning badge when spending limit is exceeded (OPT-2).

### 3. Pie Chart

- `<canvas id="categoryChart">` sized via CSS (max-width: 280 px on mobile, 320 px on desktop).
- Rendered by Chart.js. Destroyed and re-created on every data change to avoid animation artefacts.
- Category colours (consistent everywhere in the app):
  - Food → `#FF6384`
  - Transport → `#36A2EB`
  - Fun → `#FFCE56`
- Hidden (display: none) when transaction list is empty; replaced by a "No transactions yet" message.

### 4. Input Form

Fields rendered as a flex-row on desktop, stacked on mobile:

| Field | Element | Validation |
|-------|---------|-----------|
| Item Name | `<input type="text">` | Non-empty, trimmed |
| Amount | `<input type="number" min="0.01" step="0.01">` | > 0 |
| Category | `<select>` | One of Food / Transport / Fun |
| Add button | `<button type="submit">` | — |

Inline error messages appear beneath each invalid field. All errors clear on the next submit attempt.

### 5. Controls Row (OPT-1, OPT-2)

- **Sort dropdown** — options: Newest First, Oldest First, Amount ↑, Amount ↓.
- **Spending Limit input** — number field + "Set" button. Persisted to localStorage.

### 6. Transaction List

- `<ul>` inside a `<div>` with `overflow-y: auto; max-height: 400px`.
- Each `<li>` contains:
  - Category colour dot (small circle, consistent colour).
  - Item name.
  - Amount (right-aligned, bold).
  - Category label (subtle badge).
  - Delete button (×).
- Keyboard-accessible delete (focusable, Enter/Space activates).

---

## JavaScript Module Design (`js/app.js`)

```
app.js
│
├── CONFIG
│   └── CATEGORY_COLORS   // { Food: '#FF6384', ... }
│
├── STATE
│   ├── transactions[]
│   ├── spendingLimit
│   └── currentSort
│
├── STORAGE
│   ├── loadTransactions()  → Transaction[]
│   ├── saveTransactions()
│   ├── loadLimit()         → number | null
│   ├── saveLimit()
│   ├── loadTheme()         → 'light' | 'dark'
│   └── saveTheme()
│
├── SORT
│   └── getSortedTransactions()  → Transaction[]
│
├── RENDER
│   ├── renderBalance()
│   ├── renderChart()
│   ├── renderList()
│   └── renderAll()          // calls all three above
│
├── ACTIONS
│   ├── addTransaction(name, amount, category)
│   ├── deleteTransaction(id)
│   ├── setSpendingLimit(value)
│   └── setSort(sortKey)
│
└── INIT
    ├── initTheme()
    └── bindEvents()         // all addEventListener calls
```

All functions are pure or clearly side-effect-isolated. No global state mutation outside the STATE block.

---

## CSS Design (`css/style.css`)

### Theming via CSS custom properties

```css
:root {
  --bg:           #f5f5f5;
  --surface:      #ffffff;
  --text:         #1a1a1a;
  --text-muted:   #666666;
  --accent:       #4f46e5;   /* indigo */
  --danger:       #ef4444;
  --border:       #e2e8f0;
  --shadow:       rgba(0,0,0,0.08);
}

[data-theme="dark"] {
  --bg:           #0f172a;
  --surface:      #1e293b;
  --text:         #f1f5f9;
  --text-muted:   #94a3b8;
  --accent:       #818cf8;
  --danger:       #f87171;
  --border:       #334155;
  --shadow:       rgba(0,0,0,0.4);
}
```

All colours reference variables — toggling the theme attribute flips the whole UI instantly.

### Responsive breakpoint

```css
/* Mobile-first base styles, then: */
@media (min-width: 640px) { /* desktop two-column layout */ }
```

### Typography

- Font: system-ui stack (no external font dependency, fast load).
- Base size: 16 px; balance figure: 2 rem bold; section headings: 1 rem uppercase tracking.

---

## External Dependencies

| Dependency | Source | Version |
|------------|--------|---------|
| Chart.js   | `https://cdn.jsdelivr.net/npm/chart.js` | latest stable (4.x) |

No other external libraries. No npm, no bundler.

---

## Accessibility Notes

- All form inputs have associated `<label>` elements.
- Colour is never the sole indicator — category badges also show text.
- Focus styles are visible (not removed).
- Delete buttons have `aria-label="Delete [item name]"` for screen readers.
- Colour contrast meets WCAG AA for both light and dark themes.
