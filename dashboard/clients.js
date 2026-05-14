const noClientStatement = "No clients found";

document.addEventListener('DOMContentLoaded', async () => {
    const result = await DB.getClients({ page: 1, perPage: 20 });
    renderClientsTable(result);
    renderClientStats(result);
});

/* ── Stats cards ─────────────────────────────────────────── */
async function renderClientStats(result) {
  const stats = result.stats;
  if (!stats) return;

  // Total clients
  const totalEl = document.getElementById('stat-total-clients');
  if (totalEl) totalEl.textContent = stats.total_clients;

  // New this month
  const newEl = document.getElementById('stat-new-clients');
  if (newEl) {
    if (stats.new_this_month > 0) {
      newEl.innerHTML = `<i class="fa-solid fa-arrow-up"></i> +${stats.new_this_month} new this month`;
      newEl.className = 'page-stat-sub up';
    } else {
      newEl.textContent = 'No new clients this month';
      newEl.className = 'page-stat-sub';
    }
  }

  // Active clients (with events)
  const activeEl = document.getElementById('stat-active-clients');
  if (activeEl) activeEl.textContent = stats.active_clients;

  // VIP clients (3+ events) — fetch all clients to count
  const allResult = await DB.getClients({ page: 1, perPage: 9999 });
  const vipCount = allResult.data.filter(c => parseInt(c.event_count || 0) >= 3).length;
  const vipEl = document.getElementById('stat-vip-clients');
  if (vipEl) vipEl.textContent = vipCount;

  // Retention rate
  const retentionEl = document.getElementById('stat-retention-rate');
  if (retentionEl) retentionEl.textContent = stats.retention_rate + '%';
}

/* ── Table rendering ─────────────────────────────────────── */
function renderClientsTable(result) {
  const tbody = document.getElementById('clients-tbody');
  const countEl = document.getElementById('clients-count');
  const paginationEl = document.getElementById('clients-pagination');

  if (!result.data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--text-gray);">${noClientStatement}</td></tr>`;
    if (countEl) countEl.textContent = 'No clients';
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }

  tbody.innerHTML = result.data.map(ev => {
    const eventCount = ev.event_count || 0;
    const totalSpent = Number(ev.total_spent || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    const initials = ev.initials || (ev.name ? ev.name.split(',')[0].trim().charAt(0).toUpperCase() : '?');

    return `
    <tr>
        <td style="padding-left: 24px;">
        <div class="client-cell">
            <div class="client-mini-avatar">${initials}</div>
            <span style="font-weight: 600; color: var(--text-white);">${ev.name || 'N/A'}</span>
        </div>
        </td>
        <td style="color: var(--text-gray);">${ev.email || 'N/A'}</td>
        <td style="color: var(--text-gray);">N/A</td>
        <td style="color: var(--text-white);">${eventCount}</td>
        <td style="color: var(--text-gray);">₱${totalSpent}</td>
        <td>
        <button class="row-action-btn" style="color: var(--jazz-gold); font-size: 0.9rem; margin-right: 8px;"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="row-action-btn" style="color: var(--jazz-gold); font-size: 0.9rem;"><i class="fa-regular fa-trash-can"></i></button>
        </td>
    </tr>`;
  }).join('');

  const total = result.total;
  const start = (result.page - 1) * result.perPage + 1;
  const end   = Math.min(result.page * result.perPage, total);
  if (countEl) countEl.textContent = `Showing ${start}–${end} of ${total} clients`;

  const totalPages = Math.ceil(total / result.perPage);
  if (paginationEl) {
    paginationEl.innerHTML = `
      <button class="pg-btn" onclick="changePage(${result.page - 1})" ${result.page <= 1 ? 'disabled' : ''}>Previous</button>
      ${Array.from({length: totalPages}, (_, i) =>
        `<button class="pg-btn ${i+1 === result.page ? 'active' : ''}" onclick="changePage(${i+1})">${i+1}</button>`
      ).join('')}
      <button class="pg-btn" onclick="changePage(${result.page + 1})" ${result.page >= totalPages ? 'disabled' : ''}>Next</button>
    `;
  }
}

async function changePage(page) {
  if (page < 1) return;
  const result = await DB.getClients({ page, perPage: 20 });
  renderClientsTable(result);
}