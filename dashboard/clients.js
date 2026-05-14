const noClientStatement = "No clients found";

document.addEventListener('DOMContentLoaded', async () => {
    renderClientsTable(await DB.getClients({ page: 1, perPage: 20 }));
});

function renderClientsTable(result) {
  const tbody = document.getElementById('clients-tbody');
  const countEl = document.getElementById('clients-count');
  const paginationEl = document.getElementById('clients-pagination');

  if (!result.data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--text-gray);">${noClientStatement}</td></tr>`;
    countEl.textContent = 'No clients';
    paginationEl.innerHTML = '';
    return;
  }

  tbody.innerHTML = result.data.map(ev => `
    <tr>
        <td style="padding-left: 24px;">
        <div class="client-cell">
            <div class="client-mini-avatar">${ev.initials || 'E'}</div>
            <span style="font-weight: 600; color: var(--text-white);">${ev.name || 'N/A'}</span>
        </div>
        </td>
        <td style="color: var(--text-gray);">${ev.email || 'N/A'}</td>
        <td style="color: var(--text-gray);">${ev.phone || 'N/A'}</td>
        <td style="color: var(--text-white);">5</td>
        <td style="color: var(--text-gray);">₱800,000</td>
        <td>
        <button class="row-action-btn" style="color: var(--jazz-gold); font-size: 0.9rem; margin-right: 8px;"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="row-action-btn" style="color: var(--jazz-gold); font-size: 0.9rem;"><i class="fa-regular fa-trash-can"></i></button>
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