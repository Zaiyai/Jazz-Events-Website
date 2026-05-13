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

function formatPeso(amount) {
  return '₱' + Number(amount);
}

function formatInitials(name) {
  if (!name || !String(name).trim()) return '?';
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : first;
  return (first + last).toUpperCase();
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Status pill HTML ─────────────────────────────────────── */
function statusPill(status) {
  const map = {
    COMPLETED:  'status-completed',
    ONGOING:    'status-ongoing',
    PLANNING:   'status-planning',
    BLOCKED:    'status-blocked',
    PENDING:    'status-pending',
    CONFIRMED:  'status-confirmed',
    CANCELLED:  'status-cancelled'
  };
  const cls = map[status] || 'status-pending';
  return `<span class="status-pill ${cls}">${capitalize(status)}</span>`;
}

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
}

/* ── Mobile nav overlay (Main Site Only) ────────────────── */
function initMobileNav() {
  const openBtn  = document.getElementById('nav-open');
  const closeBtn = document.getElementById('nav-close');
  const overlay  = document.getElementById('nav-overlay');
  if (!overlay) return;
  openBtn?.addEventListener('click', () => { overlay.classList.add('open'); document.body.classList.add('menu-open'); });
  closeBtn?.addEventListener('click', () => { overlay.classList.remove('open'); document.body.classList.remove('menu-open'); });
}

function guestOnly(redirectTo = 'dashboard.html') {
  const user = DB.getUser();
  if (user) { window.location.href = redirectTo; }
}

/* ── Role-based Permissions ─────────────────────────────── */
function initPermissions() {
  const userType = COOKIES.getCookie("user_type");
  const path = window.location.pathname.toLowerCase();
  
  // Basic Auth Check: Only ADMIN and STAFF can access dashboard area
  if (userType !== 'ADMIN' && userType !== 'STAFF') {
    window.location.href = '../home.html';
    return;
  }

  // Staff Restrictions
  if (userType === 'STAFF') {
    // 1. Page Access Control (Redirect to staff folder)
    if (path.includes('clients.html') || path.includes('analytics.html') || (path.includes('dashboard.html') && !path.includes('/staff/'))) {
      showToast("Access Denied: Redirecting to Staff Panel...", "error");
      setTimeout(() => {
        window.location.href = '../staff/dashboard.html';
      }, 1500);
    }
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
  initPermissions();
});