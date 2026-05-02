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
  let initials = [ name[0], name.trim().split(' ').at(-1)[0] ];
  return initials.join("");
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Status pill HTML ─────────────────────────────────────── */
function statusPill(status) {
  console.log(status)
  const map = {
    COMPLETED:  'status-completed',
    ONGOING:    'status-ongoing',
    PLANNING:   'status-planning',
    BLOCKED:    'status-blocked',
  };
  const cls = map[status] || 'status-planning';
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

function guestOnly(redirectTo = 'dashboard.html') {
  const user = DB.getUser();
  if (user) { window.location.href = redirectTo; }
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

  const sidebar = document.getElementsByClassName('sidebar')[0];
  document.getElementById('sidebar-trigger').addEventListener('mouseenter', () => { sidebar.style.width = "250px"; });
  sidebar.addEventListener('mouseleave', () => { sidebar.style.width = "0"; });
});
