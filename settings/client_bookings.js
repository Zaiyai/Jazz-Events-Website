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
    return `
      <tr class="booking-main-row">
        <td class="booking-image-cell">
          <img class="booking-thumb" src="${bk.image || '../assets/placeholder-event.jpg'}" alt="${bk.name}">
        </td>
        <td class="booking-info-cell">
          <div class="info-grid">
            <span class="info-label">Event name:</span>
            <span class="info-value">${bk.name}</span>
            <span class="info-label">Status:</span>
            <span class="info-value" style="text-transform: capitalize;">${bk.status}</span>
            <span class="info-label">Date:</span>
            <span class="info-value">${bk.date_from}</span>
          </div>
        </td>
        <td class="booking-actions-cell">
          <a href="client_booking_details.html?id=${bk.booking_id}" class="btn-action">More Details</a>
        </td>
      </tr>
    `;
  }).join('');
}

function formatPeso(amount) {
  return '₱' + Number(amount);
}