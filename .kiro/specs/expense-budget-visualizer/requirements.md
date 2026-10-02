# Requirements — Expense & Budget Visualizer

## Overview

A single-page web app that lets a user log expenses, view a running balance, and visualise category spending via a pie chart. Entirely client-side: HTML + CSS + vanilla JavaScript, data persisted in browser Local Storage.

---

## Functional Requirements

### FR-1 — Input Form

- **FR-1.1** The form MUST contain three fields:
  - **Item Name** — free-text input
  - **Amount** — numeric input (positive numbers only)
  - **Category** — dropdown with exactly three options: Food, Transport, Fun
- **FR-1.2** All three fields are required. Submitting with any field empty MUST show an inline validation error and prevent the transaction from being saved.
- **FR-1.3** Amount MUST be validated as a positive number greater than zero.
- **FR-1.4** On successful submission the form MUST reset to its empty/default state.

### FR-2 — Transaction List

- **FR-2.1** All saved transactions MUST be displayed in a scrollable list below the form.
- **FR-2.2** Each list item MUST show: Item Name, Amount (formatted as currency), and Category.
- **FR-2.3** Each list item MUST include a Delete button that immediately removes the transaction.
- **FR-2.4** The list MUST be ordered with the most-recently-added transaction at the top (default sort).
- **FR-2.5** When the list is empty, a friendly empty-state message MUST be shown.

### FR-3 — Total Balance

- **FR-3.1** A total balance (sum of all transaction amounts) MUST be displayed prominently at the top of the page.
- **FR-3.2** The balance MUST update immediately whenever a transaction is added or deleted — no manual refresh required.

### FR-4 — Pie Chart

- **FR-4.1** A pie chart MUST visualise spending grouped by category (Food, Transport, Fun).
- **FR-4.2** The chart MUST be rendered using **Chart.js** (loaded via CDN).
- **FR-4.3** The chart MUST update immediately whenever the transaction list changes.
- **FR-4.4** When there are no transactions the chart MUST either hide or display a "No data" placeholder.
- **FR-4.5** Each category MUST use a distinct, consistent colour across the chart and the transaction list.

### FR-5 — Data Persistence

- **FR-5.1** All transactions MUST be saved to `localStorage` so they survive a page refresh.
- **FR-5.2** On page load the app MUST restore all previously saved transactions and render them correctly (list, balance, chart).

---

## Optional / Challenge Requirements

### OPT-1 — Sort Transactions

- **OPT-1.1** A sort control MUST let the user reorder the transaction list by: Newest First (default), Oldest First, Amount High→Low, Amount Low→High.
- **OPT-1.2** Sort preference does NOT need to be persisted across sessions.

### OPT-2 — Spending Limit Highlight

- **OPT-2.1** The user MUST be able to set a spending limit (a numeric threshold).
- **OPT-2.2** When total spending reaches or exceeds the limit, a visible warning indicator MUST appear (e.g. the balance turns red, a banner appears).
- **OPT-2.3** The warning MUST clear automatically when spending drops below the limit again.

### OPT-3 — Dark / Light Mode Toggle

- **OPT-3.1** A toggle button MUST switch the UI between light mode and dark mode.
- **OPT-3.2** The chosen mode MUST be persisted in `localStorage` and restored on next load.
- **OPT-3.3** The toggle MUST be reachable without scrolling (e.g. fixed in the header).

---

## Technical Constraints

| ID   | Constraint |
|------|-----------|
| TC-1 | HTML, CSS, and vanilla JavaScript only — no frameworks, no build tools, no backend |
| TC-2 | All data stored client-side using browser `localStorage` |
| TC-3 | Must work correctly in Chrome, Firefox, Edge, and Safari (latest stable versions) |

**Folder rules:**
- Exactly **one** CSS file at `css/style.css`
- Exactly **one** JS file at `js/app.js`
- Entry point: `index.html` at project root

---

## Non-Functional Requirements

| ID    | Requirement |
|-------|------------|
| NFR-1 | Simple, clean, minimal UI — no complex setup, no test framework |
| NFR-2 | Fast load; all interactions (add, delete, sort) feel instant with no perceptible lag |
| NFR-3 | User-friendly visual hierarchy; readable typography; accessible colour contrast |
| NFR-4 | Fully responsive — usable on mobile screens (≥ 320 px wide) and desktop |
