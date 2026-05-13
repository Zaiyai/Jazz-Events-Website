var events;
let dashboardCurrentUser = null;
let eventsPage = 1;
let noEventStatement = "Wala po event...";
const eventsPerPage = 4;
let allEventsCache = [];
let calYear, calMonth;
let filterStatus = '', filterClient = '';
let deletePending = null;

async function refreshEventsCache() {
  events = await getData('events');
}

function paginateEvents(all, page) {
  const start = (page - 1) * eventsPerPage;
  return {
    data: all.slice(start, start + eventsPerPage),
    total: all.length,
    page,
    perPage: eventsPerPage,
  };
}

async function populateClientSelect() {
  const sel = document.getElementById('ev-client');
  if (!sel) return;
  const email = COOKIES.getCookie('email');
  if (!email) return;
  try {
    const res = await fetch('../scripts/clients/list_clients.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    const keep = sel.value;
    sel.innerHTML = '<option value="">Select a client</option>';
    if (data.ok && Array.isArray(data.clients)) {
      for (const c of data.clients) {
        const opt = document.createElement('option');
        opt.value = c.user_id;
        opt.textContent = c.name;
        sel.appendChild(opt);
      }
    }
    if (keep) sel.value = keep;
  } catch (e) {
    console.warn('Could not load clients list', e);
  }
} 


/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const user = await DB.getUser();
  if (!user) window.location.href = '../home.html';
  dashboardCurrentUser = user;

  await refreshEventsCache();
  await populateClientSelect();

  var words = user.name.trim().split(/\s+/);
  var initials = words.map(function(w){ return w[0]; }).join('').toUpperCase().substring(0,2);
  const pfp = document.getElementById('profile-avatar-initials');

  // Populate sidebar user info
  document.getElementById('sidebar-name').textContent = user.name;
  if (user.profile_picture) {
    // Use correct path with prefix
    pfp.innerHTML = '<img src="' + prefix + user.profile_picture + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
    document.getElementById('sidebar-avatar').innerHTML = '<img src="' + prefix + user.profile_picture + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
  } else {
    pfp.textContent = initials;
    document.getElementById('sidebar-avatar').textContent = initials;
  }
  document.getElementById('topbar-greeting').textContent = `Welcome back, ${user.name.split(' ')[0]}`;

  // Calendar
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();

  // Load everything in parallel
  await Promise.all([
    loadEvents()
  ]);
  renderCalendar();
  renderDonut();
  renderRevenueChart();

  // Search
  document.getElementById('dash-search-input')?.addEventListener('input', debounce(handleSearch, 300));

  // Filter toggle
  document.getElementById('btn-filter-events')?.addEventListener('click', () => {
    const bar = document.getElementById('filter-bar');
    bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
  });

  // Export
  document.getElementById('btn-export-events')?.addEventListener('click', exportEvents);
});

/* ── Stats ────────────────────────────────────────────────── */
async function loadStats() {
  const stats = await DB.getStats();
  const grid = document.getElementById('stats-grid');
  if (!grid) return;
  grid.innerHTML = `
    ${statCard('fa-peso-sign',     'Total Revenue',    stats.totalRevenue.value,    stats.totalRevenue.change,    stats.totalRevenue.sub,    'up')}
    ${statCard('fa-calendar-days', 'Active Events',    stats.activeEvents.value,    stats.activeEvents.change,    stats.activeEvents.sub,    'up')}
    ${statCard('fa-clock',         'Pending Payments', stats.pendingPayments.value, stats.pendingPayments.change, stats.pendingPayments.sub, 'warn')}
    ${statCard('fa-heart',         'Client Satisfaction', stats.satisfaction.value, stats.satisfaction.change,    stats.satisfaction.sub,    'up')}
  `;
}

function statCard(icon, label, value, change, sub, badgeType) {
  const badge = change
    ? `<span class="stat-badge ${badgeType}">${badgeType === 'warn' ? '<i class="fa-solid fa-triangle-exclamation"></i> Action needed' : '↑ ' + change}</span>`
    : '';
  return `
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon"><i class="fa-solid ${icon}"></i></div>
        ${badge}
      </div>
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-sub">${sub}</div>
    </div>`;
}

/* ── Events Table ─────────────────────────────────────────── */
async function loadEvents() {
  await refreshEventsCache();
  const maxPage = Math.max(1, Math.ceil(events.length / eventsPerPage) || 1);
  if (eventsPage > maxPage) eventsPage = maxPage;
  const result = paginateEvents(events, eventsPage);
  allEventsCache = result;
  renderEventsTable(result);
}

function renderEventsTable(result) {
  const tbody = document.getElementById('events-tbody');
  const countEl = document.getElementById('events-count');
  const paginationEl = document.getElementById('events-pagination');

  if (!result.data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--text-gray);">${noEventStatement}</td></tr>`;
    countEl.textContent = 'No events';
    paginationEl.innerHTML = '';
    return;
  }

  tbody.innerHTML = result.data.map(ev => `
    <tr>
      <td>
        <div class="event-cell">
          <div class="event-thumb">${ev.emoji || '🎉'}</div>
          <div>
            <div class="event-name">${ev.name}</div>
            <div class="event-type">${ev.type} · ${ev.no_of_guests} Guests</div>
          </div>
        </div>
      </td>
      <td>
        <div class="client-cell">
          <div class="client-mini-avatar">${formatInitials(ev.client_name || '')}</div>
          ${ev.client_name || '—'}
        </div>
      </td>
      <td>${formatDate(ev.date)}</td>
      <td>${ev.venue}</td>
      <td>${statusPill(ev.status)}</td>
      <td class="amount-cell">${formatPeso(ev.amount)}</td>
      <td>
        <button class="row-action-btn" onclick="editEvent('${ev.event_id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="row-action-btn" onclick="confirmDelete('event','${ev.event_id}','${ev.name}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  const total = result.total;
  const start = (result.page - 1) * result.perPage + 1;
  const end   = Math.min(result.page * result.perPage, total);
  countEl.textContent = `Showing ${start}–${end} of ${total} events`;

  const totalPages = Math.ceil(total / result.perPage);
  paginationEl.innerHTML = `
    <button class="pg-btn" onclick="changePage(${result.page - 1})" ${result.page <= 1 ? 'disabled' : ''}>Previous</button>
    ${Array.from({length: totalPages}, (_, i) =>
      `<button class="pg-btn ${i+1 === result.page ? 'active' : ''}" onclick="changePage(${i+1})">${i+1}</button>`
    ).join('')}
    <button class="pg-btn" onclick="changePage(${result.page + 1})" ${result.page >= totalPages ? 'disabled' : ''}>Next</button>
  `;
}

async function changePage(page) {
  if (page < 1) return;
  const totalPages = Math.max(1, Math.ceil(events.length / eventsPerPage));
  if (page > totalPages) return;
  eventsPage = page;
  const result = paginateEvents(events, page);
  renderEventsTable(result);
}

/* ── Event CRUD ───────────────────────────────────────────── */
function openNewEventModal() {
  document.getElementById('event-modal-title').textContent = 'New Event';
  document.getElementById('event-edit-id').value = '';
  ['ev-name','ev-type','ev-client','ev-guests','ev-date','ev-venue','ev-theme','ev-amount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('ev-status').value = 'PLANNING';
  openModal('modal-new-event');
}

const eventModalTitle = document.getElementById('event-modal-title');

async function addEvent() {
  eventModalTitle.textContent = 'New Event';
  openModal('modal-new-event');
}

async function editEvent(id) {
  const ev = events.find(e => String(e.event_id) === String(id));
  if (!ev) return;
  eventModalTitle.textContent = 'Edit Event';
  document.getElementById('event-edit-id').value = id;
  document.getElementById('ev-name').value   = ev.name || '';
  document.getElementById('ev-type').value   = ev.type || '';
  document.getElementById('ev-client').value = ev.client_id != null ? String(ev.client_id) : '';
  document.getElementById('ev-guests').value = ev.no_of_guests || '';
  document.getElementById('ev-date').value   = ev.date || '';
  document.getElementById('ev-venue').value  = ev.venue || '';
  document.getElementById('ev-theme').value  = ev.theme || '';
  document.getElementById('ev-status').value = ev.status || 'PLANNING';
  document.getElementById('ev-amount').value = ev.amount || '';
  openModal('modal-new-event');
}

async function saveEvent() {
  const valid = validateForm([
    { id: 'ev-name',   msg: 'Event name is required.' },
    { id: 'ev-client', msg: 'Please select a client.' },
    { id: 'ev-date',   msg: 'Date is required.' },
    { id: 'ev-venue',  msg: 'Venue is required.' },
  ]);
  if (!valid) return;
  console.log("HEllo")

  const clientId = parseInt(document.getElementById('ev-client').value, 10);
  if (!clientId || Number.isNaN(clientId)) {
    showToast('Please select a client.', 'error');
    return;
  }

  const id = document.getElementById('event-edit-id').value;
  const name = document.getElementById('ev-name').value.trim();
  const data = {
    name,
    type:         document.getElementById('ev-type').value.trim()        || 'Event',
    client_id:    clientId,
    no_of_guests: parseInt(document.getElementById('ev-guests').value)   || 0,
    date:         document.getElementById('ev-date').value,
    venue:        document.getElementById('ev-venue').value.trim(),
    theme:        document.getElementById('ev-theme').value.trim(),
    status:       document.getElementById('ev-status').value,
    amount:       parseFloat(document.getElementById('ev-amount').value) || 0,
    created_by:   dashboardCurrentUser && dashboardCurrentUser.name ? dashboardCurrentUser.name : 'Admin',
  };

  // If edit, update event, else add new event
  if (id) {
    await DB.updateEvent(id, data);
    showToast(`"${name}" updated successfully.`);
  } else {
    await DB.createEvent(data);
    showToast(`"${name}" added successfully.`);
  }
  closeModal('modal-new-event');
  eventsPage = 1;
  await loadEvents();
  renderCalendar();
  renderDonut();
}

/* ── Delete ───────────────────────────────────────────────── */
function confirmDelete(type, id, name) {
  deletePending = { type, id };
  document.getElementById('delete-msg').textContent = `Delete "${name}"? This cannot be undone.`;
  document.getElementById('delete-confirm-btn').onclick = executeDelete;
  openModal('modal-delete');
}

async function executeDelete() {
  if (!deletePending) return;
  const { type, id } = deletePending;
  if (type === 'event') {
    await DB.deleteEvent(id);
    showToast('Event deleted.');
    await loadEvents();
    renderCalendar();
    renderDonut();
  } else if (type === 'task') {
    await DB.deleteTask(id);
    showToast('Task deleted.');
    await loadTasks();
  }
  closeDelete();
}

function closeDelete() {
  deletePending = null;
  closeModal('modal-delete');
}

/* ── Filters ──────────────────────────────────────────────── */
function applyFilters() {
  const fs = document.getElementById('filter-status');
  const fc = document.getElementById('filter-client');
  filterStatus = fs ? fs.value : '';
  filterClient = fc ? fc.value.trim().toLowerCase() : '';
  applyFilterLogic();
}

function clearFilters() {
  const fs = document.getElementById('filter-status');
  const fc = document.getElementById('filter-client');
  if (fs) fs.value = '';
  if (fc) fc.value = '';
  filterStatus = '';
  filterClient = '';
  loadEvents();
}

function applyFilterLogic() {
  const all = Array.isArray(events) ? events : [];
  const clientKey = (ev) => (ev.client_name || '').toLowerCase();
  const filtered = all.filter(ev => {
    const statusMatch = !filterStatus || ev.status === filterStatus;
    const clientMatch = !filterClient || clientKey(ev).includes(filterClient);
    return statusMatch && clientMatch;
  });
  const sliced = filtered.slice(0, eventsPerPage);
  renderEventsTable({ data: sliced, total: filtered.length, page: 1, perPage: eventsPerPage });
}

/* ── Export ───────────────────────────────────────────────── */
function exportEvents() {
  const all = Array.isArray(events) ? events : [];
  const csv = [
    ['Name','Type','Client','Date','Venue','Status','Amount'],
    ...all.map(e => [e.name, e.type, e.client_name || '', e.date, e.venue, e.status, e.amount])
  ].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'jazz-events-export.csv';
  a.click();
  showToast('Events exported as CSV.');
}

/* ── Search ───────────────────────────────────────────────── */
function handleSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    eventsPage = 1;
    loadEvents();
    return;
  }
  const all = Array.isArray(events) ? events : [];
  const filtered = all.filter(ev =>
    (ev.name || '').toLowerCase().includes(q) ||
    (ev.client_name || '').toLowerCase().includes(q) ||
    (ev.venue || '').toLowerCase().includes(q)
  );
  renderEventsTable({ data: filtered.slice(0, eventsPerPage), total: filtered.length, page: 1, perPage: eventsPerPage });
}

/* ── Tasks ────────────────────────────────────────────────── */
async function loadTasks() {
  const tasks = await DB.getTasks();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const el = document.getElementById('tasks-list');
  if (!tasks.length) {
    el.innerHTML = `<p style="font-size:0.75rem;color:var(--text-gray);padding:8px 0;">No tasks. Add one!</p>`;
    return;
  }
  el.innerHTML = tasks.map(t => `
    <div class="task-item ${t.done ? 'done' : ''}" id="task-item-${t.id}">
      <input type="checkbox" class="task-cb" ${t.done ? 'checked' : ''} onchange="toggleTask('${t.id}')">
      <div style="flex:1">
        <div class="task-name">${t.name}</div>
        <div class="task-due">${t.due ? 'Due on ' + t.due : ''}${t.location ? ' · ' + t.location : ''}</div>
      </div>
      <button class="row-action-btn" onclick="confirmDelete('task','${t.id}','${t.name.replace(/'/g,"\\'")}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

async function toggleTask(id) {
  await DB.toggleTask(id);
  await loadTasks();
}

async function saveTask() {
  const valid = validateForm([{ id: 'task-name', msg: 'Task name is required.' }]);
  if (!valid) return;
  const name     = document.getElementById('task-name').value.trim();
  const due      = document.getElementById('task-due').value.trim();
  const location = document.getElementById('task-location').value.trim();
  await DB.createTask({ name, due, location });
  showToast('Task added.');
  closeModal('modal-new-task');
  document.getElementById('task-name').value = '';
  document.getElementById('task-due').value = '';
  document.getElementById('task-location').value = '';
  await loadTasks();
}

/* ── Calendar ─────────────────────────────────────────────── */
function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

async function renderCalendar() {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  document.getElementById('cal-month-label').textContent = `${MONTHS[calMonth]} ${calYear}`;

  // Build a map of day -> array of event names
  const eventsByDay = {};
  events
    .filter(e => { const d = new Date(e.date); return d.getFullYear() === calYear && d.getMonth() === calMonth; })
    .forEach(e => {
      const day = new Date(e.date).getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e.name, e.status);
    });

  const eventDays = new Set(Object.keys(eventsByDay).map(d => parseInt(d)));

  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev  = new Date(calYear, calMonth, 0).getDate();

  let html = DAYS.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  // Prev month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month">${daysInPrev - i}</div>`;
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
    const hasEvent = eventDays.has(d);
    const eventNames = hasEvent ? eventsByDay[d][0] : '';
    const eventStatus = hasEvent ? eventsByDay[d][1] : '';
    const title = hasEvent ? `Events:\n${eventNames}` : '';
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}" ${title ? `title="${title}"` : ''} data-events="${eventNames}" data-status="${eventStatus.toLowerCase()}">${d}</div>`;
  }
  // Next month overflow
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  for (let d = 1; d <= totalCells - firstDay - daysInMonth; d++) {
    html += `<div class="cal-day other-month">${d}</div>`;
  }

  document.getElementById('cal-grid').innerHTML = html;
}

/* ── Donut chart ──────────────────────────────────────────── */
function renderDonut() {
  const counts = {};
  events.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
  const total = events.length;

  // Group into Corporate / Wedding / Private
  const buckets = { Corporate: 0, Wedding: 0, Private: 0 };
  Object.entries(counts).forEach(([type, n]) => {
    if (type.toLowerCase().includes('wedding')) buckets.Wedding += n;
    else if (type.toLowerCase().includes('private') || type.toLowerCase().includes('birthday')) buckets.Private += n;
    else buckets.Corporate += n;
  });

  const colors = ['#d4af37','#f0d78c','#7a6020'];
  const labels = Object.keys(buckets);
  const values = Object.values(buckets);

  const R = 55, STROKE = 26;
  const circumference = 2 * Math.PI * R;
  let offset = 0;
  const svgEl = document.getElementById('donut-svg');
  if (!svgEl) return;
  const existingArcs = svgEl.querySelectorAll('.donut-arc');
  existingArcs.forEach(a => a.remove());

  labels.forEach((label, i) => {
    const pct  = total ? values[i] / total : 0;
    const dash = pct * circumference;
    const arc  = document.createElementNS('http://www.w3.org/2000/svg','circle');
    arc.setAttribute('class','donut-arc');
    arc.setAttribute('cx','80'); arc.setAttribute('cy','80'); arc.setAttribute('r', R);
    arc.setAttribute('fill','none');
    arc.setAttribute('stroke', colors[i]);
    arc.setAttribute('stroke-width', STROKE);
    arc.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
    arc.setAttribute('stroke-dashoffset', -offset * circumference / (2 * Math.PI * R) * R * 2 * Math.PI);
    arc.setAttribute('transform','rotate(-90 80 80)');
    svgEl.insertBefore(arc, svgEl.lastElementChild);
    offset += pct * circumference;
  });

  // Inner circle
  let inner = svgEl.querySelector('.donut-inner');
  if (!inner) {
    inner = document.createElementNS('http://www.w3.org/2000/svg','circle');
    inner.setAttribute('class','donut-inner');
    inner.setAttribute('cx','80'); inner.setAttribute('cy','80');
    inner.setAttribute('r','42'); inner.setAttribute('fill','#1a1a1a');
    svgEl.appendChild(inner);
  }

  const legend = document.getElementById('donut-legend');
  if (legend) {
    legend.innerHTML = labels.map((l, i) => {
      const pct = total ? Math.round(values[i]/total*100) : 0;
      return `<div class="legend-item">
        <div class="legend-left"><div class="legend-dot" style="background:${colors[i]}"></div>${l}</div>
        <div class="legend-pct">${pct}%</div>
      </div>`;
    }).join('');
  }
}

/* ── Revenue Line Chart ───────────────────────────────────── */
function renderRevenueChart() {
  const data = [28000, 32000, 35000, 38000, 42000, 48295]; // Last 6 months
  const labels = ['Jul','Aug','Sep','Oct','Nov','Dec'];
  const W = 580, H = 200, PAD = { t: 20, r: 20, b: 30, l: 45 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const minV = Math.min(...data) * 0.9;
  const maxV = Math.max(...data) * 1.05;

  const xScale = i => PAD.l + (i / (data.length - 1)) * chartW;
  const yScale = v => PAD.t + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const points = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
  const areaEnd = `${xScale(data.length-1)},${H - PAD.b} ${xScale(0)},${H - PAD.b}`;

  const gridLines = [0.25, 0.5, 0.75, 1].map(f => {
    const y = PAD.t + chartH - f * chartH;
    const val = Math.round(minV + f * (maxV - minV));
    return `
      <line x1="${PAD.l}" y1="${y}" x2="${W - PAD.r}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      <text x="${PAD.l - 6}" y="${y + 4}" text-anchor="end" fill="#4b5563" font-size="9" font-family="Montserrat">${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}</text>
    `;
  }).join('');

  const xLabels = labels.map((l, i) =>
    `<text x="${xScale(i)}" y="${H - 4}" text-anchor="middle" fill="#4b5563" font-size="9" font-family="Montserrat">${l}</text>`
  ).join('');

  const circles = data.map((v, i) =>
    `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="${i === data.length-1 ? 5.5 : 4}" fill="#d4af37" stroke="#1a1a1a" stroke-width="2"/>`
  ).join('');

  const svg = document.getElementById('revenue-svg');
  if (!svg) return;
  svg.innerHTML = `
    <defs>
      <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d4af37" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#d4af37" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${gridLines}
    ${xLabels}
    <polygon points="${points} ${areaEnd}" fill="url(#revGrad2)"/>
    <polyline points="${points}" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${circles}
  `;
}

/* ── Utilities ────────────────────────────────────────────── */
function debounce(fn, ms) {
  let timer;
  return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), ms); };
}

// Expose to inline onclick handlers
window.editEvent        = editEvent;
window.confirmDelete    = confirmDelete;
window.executeDelete    = executeDelete;
window.closeDelete      = closeDelete;
window.changePage       = changePage;
window.calNav           = calNav;
window.applyFilters     = applyFilters;
window.clearFilters     = clearFilters;
window.saveEvent        = saveEvent;
window.saveTask         = saveTask;
window.toggleTask       = toggleTask;
window.exportEvents     = exportEvents;
window.openModal        = openModal;
window.closeModal       = closeModal;
