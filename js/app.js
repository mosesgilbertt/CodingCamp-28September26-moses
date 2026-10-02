// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = { Food: "#e07a1f", Transport: "#2563eb", Fun: "#c026d3" };

const STORAGE_KEYS = {
  transactions: "ebv_transactions",
  limit:        "ebv_spending_limit",
  theme:        "ebv_theme",
};

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const loadTransactions = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) ?? [];

const saveTransactions = (arr) =>
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(arr));

const loadLimit = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.limit);
  const val = parseFloat(raw);
  return Number.isFinite(val) && val > 0 ? val : null;
};

const saveLimit = (val) => {
  if (val !== null) localStorage.setItem(STORAGE_KEYS.limit, val);
  else localStorage.removeItem(STORAGE_KEYS.limit);
};

const loadTheme = () => localStorage.getItem(STORAGE_KEYS.theme) || "light";
const saveTheme = (theme) => localStorage.setItem(STORAGE_KEYS.theme, theme);

// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
  transactions:   [],
  spendingLimit:  null,
  sort:           "newest",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

// ─── SORT ────────────────────────────────────────────────────────────────────
function getSortedTransactions() {
  const list = [...state.transactions];
  switch (state.sort) {
    case "oldest":   return list.sort((a, b) => a.timestamp - b.timestamp);
    case "high":     return list.sort((a, b) => b.amount - a.amount);
    case "low":      return list.sort((a, b) => a.amount - b.amount);
    case "category": return list.sort((a, b) => a.category.localeCompare(b.category));
    default:         return list.sort((a, b) => b.timestamp - a.timestamp); // newest
  }
}

// ─── CHART ───────────────────────────────────────────────────────────────────
let chartInstance = null;

function renderChart() {
  const canvas = $("chart");
  const totals = Object.keys(CATEGORY_COLORS).map((cat) =>
    state.transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const hasData = totals.some((v) => v > 0);

  if (!hasData) {
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    canvas.style.display = "none";
    return;
  }

  canvas.style.display = "";
  const legendColor = getComputedStyle(document.body).color;

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(canvas, {
    type: "pie",
    data: {
      labels: Object.keys(CATEGORY_COLORS),
      datasets: [{
        data: totals,
        backgroundColor: Object.values(CATEGORY_COLORS),
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: legendColor } },
      },
    },
  });
}

// ─── BALANCE ─────────────────────────────────────────────────────────────────
function renderBalance() {
  const total = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  $("total").textContent = rupiah(total);

  const warning = $("limitWarning");
  const isOver = state.spendingLimit !== null && total >= state.spendingLimit;
  warning.hidden = !isOver;
  $("total").classList.toggle("over-limit", isOver);
}

// ─── LIST ────────────────────────────────────────────────────────────────────
function renderList() {
  const ul = $("list");
  const emptyState = $("emptyState");
  const sorted = getSortedTransactions();

  if (sorted.length === 0) {
    ul.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  ul.innerHTML = "";
  sorted.forEach((t) => {
    const li = document.createElement("li");
    // Per-item highlight: item amount itself exceeds the limit (bonus visual cue)
    if (state.spendingLimit !== null && t.amount > state.spendingLimit) {
      li.classList.add("over");
    }
    li.innerHTML = `
      <div>
        <b></b>
        <small></small>
      </div>
      <span></span>
      <button type="button">&#10005;</button>`;
    li.querySelector("b").textContent = t.name;
    li.querySelector("small").textContent = t.category;
    li.querySelector("span").textContent = rupiah(t.amount);
    const delBtn = li.querySelector("button");
    delBtn.setAttribute("aria-label", `Delete ${t.name}`);
    delBtn.addEventListener("click", () => deleteTransaction(t.id));
    ul.appendChild(li);
  });
}

// ─── RENDER ALL ──────────────────────────────────────────────────────────────
function renderAll() {
  renderBalance();
  renderChart();
  renderList();
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
function addTransaction(name, amount, category) {
  state.transactions.push({
    id:        Date.now().toString(),
    name,
    amount,
    category,
    timestamp: Date.now(),
  });
  saveTransactions(state.transactions);
  renderAll();
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveTransactions(state.transactions);
  renderAll();
}

function setSpendingLimit(val) {
  state.spendingLimit = val;
  saveLimit(val);
  renderBalance();
  renderList();
}

// ─── VALIDATION ──────────────────────────────────────────────────────────────
function validateForm(name, amount, category) {
  const errors = {};
  if (!name) errors.name = "Item name is required.";
  if (!amount || isNaN(amount) || amount <= 0) errors.amount = "Enter a valid amount greater than 0.";
  if (!category) errors.category = "Please select a category.";
  return { valid: Object.keys(errors).length === 0, errors };
}

function clearErrors() {
  $("nameError").textContent = "";
  $("amountError").textContent = "";
  $("categoryError").textContent = "";
}

// ─── THEME ───────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("themeBtn").textContent = theme === "dark" ? "Light" : "Dark";
  saveTheme(theme);
  // update chart legend colour to match new theme
  if (chartInstance) {
    chartInstance.options.plugins.legend.labels.color =
      getComputedStyle(document.body).color;
    chartInstance.update();
  }
}

// ─── EVENT BINDING ───────────────────────────────────────────────────────────
function bindEvents() {
  // Form submit
  $("form").addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    const name     = $("name").value.trim();
    const amount   = parseFloat($("amount").value);
    const category = $("category").value;

    const { valid, errors } = validateForm(name, amount, category);
    if (!valid) {
      if (errors.name)     $("nameError").textContent     = errors.name;
      if (errors.amount)   $("amountError").textContent   = errors.amount;
      if (errors.category) $("categoryError").textContent = errors.category;
      return;
    }

    addTransaction(name, amount, category);
    e.target.reset();
    clearErrors();
  });

  // Sort
  $("sort").addEventListener("change", () => {
    state.sort = $("sort").value;
    renderList();
  });

  // Spending limit (total warning — OPT-2)
  $("limitInput").addEventListener("input", () => {
    const val = parseFloat($("limitInput").value);
    setSpendingLimit(Number.isFinite(val) && val > 0 ? val : null);
  });

  // Theme toggle
  $("themeBtn").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

// ─── INIT ────────────────────────────────────────────────────────────────────
function init() {
  // Restore theme first so there's no flash
  applyTheme(loadTheme());

  // Restore state
  state.transactions  = loadTransactions();
  state.spendingLimit = loadLimit();

  // Populate limit input if a limit was saved
  if (state.spendingLimit !== null) {
    $("limitInput").value = state.spendingLimit;
  }

  renderAll();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);
