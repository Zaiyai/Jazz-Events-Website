document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('bookings-tbody')) {
    await loadBookings();
  }
});

// Client Booking --------------------------------------------------------
async function loadBookings() {
  const result = await DB.getUserBookings();
  renderBookingsTable(result);
}

function renderBookingsTable(result) {
  const tbody = document.getElementById('bookings-tbody');

  if (!result.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;padding:28px;color:var(--text-gray);">
          No bookings found.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = result.map(bk => {
    // const paidMonths  = bk.paid_months ?? 0;
    // const totalMonths = bk.payment_plan ?? 12;
    // const progressPct = Math.round((paidMonths / totalMonths) * 100);
    const progressPct = 90;
    const isOverdue   = bk.status === 'overdue';
    const statusClass = isOverdue ? 'status-overdue' : 'status-ontrack';
    const statusLabel = isOverdue ? 'OVERDUE'        : 'On-track';
    const barClass    = isOverdue ? 'fill-red'       : 'fill-green';

    return `
      <tr class="booking-main-row">
        <td class="booking-image-cell">
          <img class="booking-thumb" src="${bk.image}" alt="${bk.name}">
        </td>
        <td class="booking-info-cell">
          <div class="info-grid">
            <span class="info-label">Event name:</span>
            <span class="info-value">${bk.name}</span>
            <span class="info-label">Total Due:</span>
            <span class="info-value">${formatPeso(bk.budget)}</span>
            <span class="info-label">Payment Plan:</span>
            <span class="info-value">12 months</span>
          </div>
        </td>
        <td class="booking-actions-cell">
          <a href="client_booking_details.html" class="btn-action">More Details</a>
          <button class="btn-action" onclick="showPaymentModal('${bk.booking_id}')">Pay Now</button>
        </td>
      </tr>
      <tr class="booking-progress-row">
        <td colspan="3">
          <div class="progress-labels-row">
            <span class="progress-label-main">Completed Payments:</span>
            <span class="progress-status ${statusClass}">${statusLabel}</span>
            <span class="progress-count">3 out of 12 months</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${barClass}" style="width:${progressPct}%;"></div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function formatPeso(amount) {
  return '₱' + Number(amount);
}