/* =============================================================
   JAZZ EVENTS — ui.js
   Shared UI helpers used across all pages
   ============================================================= */

/* ── Toast notifications ──────────────────────────────────── */
function showToast(message, type = 'success') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.classList.add('show'); });
  });
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ── Password toggle ─────────────────────────────────────── */
function togglePass(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
}

/* ── Format currency ─────────────────────────────────────── */
function formatPeso(amount) {
  return '₱' + Number(amount).toLocaleString('en-PH');
}

/* ── Format date ─────────────────────────────────────────── */
function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Status pill HTML ─────────────────────────────────────── */
function statusPill(status) {
  const map = {
    confirmed:  'status-confirmed',
    pending:    'status-pending',
    completed:  'status-completed',
    cancelled:  'status-cancelled',
  };
  const cls = map[status] || 'status-pending';
  return `<span class="status-pill ${cls}">${capitalize(status)}</span>`;
}

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

/* ── Mobile nav overlay ──────────────────────────────────── */
function initMobileNav() {
  const openBtn  = document.getElementById('nav-open');
  const closeBtn = document.getElementById('nav-close');
  const overlay  = document.getElementById('nav-overlay');
  if (!overlay) return;
  openBtn?.addEventListener('click', () => { overlay.classList.add('open'); document.body.classList.add('menu-open'); });
  closeBtn?.addEventListener('click', () => { overlay.classList.remove('open'); document.body.classList.remove('menu-open'); });
}

/* ── Auth guard ──────────────────────────────────────────── */
function requireAuth(redirectTo = 'login.html') {
  const user = DB.getUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

function guestOnly(redirectTo = 'dashboard.html') {
  const user = DB.getUser();
  if (user) { window.location.href = redirectTo; }
}

/* ── Render nav user state ───────────────────────────────── */
function renderNavUser(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const user = DB.getUser();
  if (user) {
    el.innerHTML = `<div class="nav-avatar" title="${user.name}" onclick="window.location.href='dashboard.html'">${user.initials}</div>`;
  } else {
    el.innerHTML = `<button class="btn-nav-login" onclick="window.location.href='login.html'">LOG IN</button>`;
  }
}

/* ── Modal helpers ───────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

/* ── Service checkboxes ──────────────────────────────────── */
function initServiceChecks() {
  document.querySelectorAll('.service-check-label').forEach(label => {
    const cb = label.querySelector('input[type=checkbox]');
    if (!cb) return;
    cb.addEventListener('change', () => label.classList.toggle('checked', cb.checked));
  });
}

/* ── Simple form validator ───────────────────────────────── */
function validateForm(fields) {
  let valid = true;
  fields.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + '-err');
    if (!el) return;
    const empty = !el.value.trim();
    el.classList.toggle('error', empty);
    if (errEl) { errEl.textContent = msg || 'This field is required.'; errEl.classList.toggle('show', empty); }
    if (empty) valid = false;
  });
  return valid;
}

/* ── Run on page load ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initServiceChecks();
});
