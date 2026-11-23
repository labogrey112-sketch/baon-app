/** app.js — BAON single-page app: routing, views, events. MIT */

import * as calc from './budget.js';

import * as db from './db.js';

const view = document.getElementById('view');

const toastEl = document.getElementById('toast');

/* ---------- state: the data the screens show ---------- */

const DEFAULT_BUDGET = {

    amount: 1000, period: 'weekly', startDate: calc.toISODate(new Date()),

};

const state = { budget: DEFAULT_BUDGET, expenses: [] };

async function loadState() {

    state.budget = await db.getSetting('budget', DEFAULT_BUDGET);
}

function renderSettings() {

    const b = state.budget;

    const opt = (p) =>

        `<option ${p === b.period ? 'selected' : ''}>${p}</option>`;

    view.innerHTML = `

<section class="card">

<h2>My baon</h2>

<form id="budgetForm">

<label>Allowance amount (₱)

<input name="amount" type="number" min="1" step="0.01"

value="${b.amount}" required></label>

<label>Every

<select name="period">

${['daily', 'weekly', 'monthly'].map(opt).join('')}

</select></label>

<label>Starting

<input name="startDate" type="date"

value="${b.startDate}" required></label>

<button class="btn lime">Save budget</button>

</form>

</section>`;

    document.getElementById('budgetForm').onsubmit = saveBudget;

}

async function saveBudget(ev) {

    ev.preventDefault();

    const d = Object.fromEntries(new FormData(ev.target));

    state.budget = {

        amount: Number(d.amount), period: d.period, startDate: d.startDate,

    };

    await db.setSetting('budget', state.budget);

    toast('Budget saved ✅');
}

/* ---------- start ---------- */

window.addEventListener('hashchange', router);

await loadState();

router();