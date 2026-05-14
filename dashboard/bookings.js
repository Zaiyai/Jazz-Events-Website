// bookings.js – UI logic for Admin Bookings page
// Fetches real data from jazz_events database via useBookings API

const PAGE_SIZE = 5;
let currentPage = 1;
let filteredBookings = [];
let allBookings = [];

async function initBookingsPage() {
  // Load initial data from the database
  await loadBookings();
  // Attach event listeners
  document.getElementById('new-booking-btn')?.addEventListener('click', openNewBookingModal);
  document.getElementById('booking-search-input')?.addEventListener('input', debounce(handleSearch, 300));
  document.getElementById('status-filter')?.addEventListener('change', applyFilters);
}

async function loadBookings() {
  const all = await window.useBookings.getBookings();
  allBookings = all;
  filteredBookings = all;
  renderStats(all);
  renderBookingsTable(all);
}

function renderStats(bookings) {
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    accepted: bookings.filter(b => b.status === 'ACCEPTED').length,
    rejected: bookings.filter(b => b.status === 'REJECTED').length,
  };
  const container = document.getElementById('booking-stats');
  if (!container) return;
  container.innerHTML = `
    ${statCard('fa-solid fa-clipboard-list', 'Total Bookings', stats.total, '', '', 'up')}
    ${statCard('fa-solid fa-hourglass-start', 'Pending', stats.pending, '', '', 'warn')}
    ${statCard('fa-solid fa-check-double', 'Accepted', stats.accepted, '', '', 'up')}
    ${statCard('fa-solid fa-ban', 'Rejected', stats.rejected, '', '', 'warn')}
  `;
}

function statCard(icon, label, value, change, sub, badgeType) {
  const badge = change
    ? `<span class="stat-badge ${badgeType}">${badgeType === 'warn' ? '<i class="fa-solid fa-triangle-exclamation"></i> Action' : '↑ ' + change}</span>`
    : '';
  return `
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon"><i class="${icon}"></i></div>
        ${badge}
      </div>
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-sub">${sub}</div>
    </div>`;
}

function renderBookingsTable(bookings) {
  const totalPages = Math.ceil(bookings.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageData = bookings.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('bookings-tbody');
  const countEl = document.getElementById('bookings-count');
  const paginationEl = document.getElementById('bookings-pagination');

  if (!tbody) return;
  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--text-gray);">No bookings found matching your criteria.</td></tr>`;
    countEl.textContent = 'No results';
    paginationEl.innerHTML = '';
    return;
  }

  tbody.innerHTML = pageData.map(b => `
    <tr>
      <td>
        <div class="client-cell">
          <div class="client-mini-avatar">${formatInitials(b.clientName)}</div>
          <div class="client-info-cell">
            <div class="client-name-text">${b.clientName}</div>
          </div>
        </div>
      </td>
      <td>${b.email}</td>
      <td>${formatDate(b.eventDate)}</td>
      <td>${b.eventType}</td>
      <td>${statusBadge(b.status)}</td>
      <td>
        <div class="actions-cell">
          <button class="row-action-btn" title="View Details" onclick="viewBooking('${b.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="row-action-btn" title="Edit Booking" onclick="editBooking('${b.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="row-action-btn danger" title="Reject Booking" onclick="confirmCancelBooking('${b.id}')"><i class="fa-solid fa-ban"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  countEl.textContent = `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, bookings.length)} of ${bookings.length} bookings`;

  // Pagination
  let pagesHtml = `<button class="pg-btn" onclick="changeBookingPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>`;
  for (let i = 1; i <= totalPages; i++) {
    pagesHtml += `<button class="pg-btn ${i === currentPage ? 'active' : ''}" onclick="changeBookingPage(${i})">${i}</button>`;
  }
  pagesHtml += `<button class="pg-btn" onclick="changeBookingPage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>`;
  paginationEl.innerHTML = pagesHtml;
}

function changeBookingPage(page) {
  currentPage = page;
  renderBookingsTable(filteredBookings);
}

function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  applyFilters(query);
}

async function applyFilters(searchQuery = '') {
  if (typeof searchQuery !== 'string') {
    searchQuery = document.getElementById('booking-search-input')?.value.toLowerCase() || '';
  }
  const statusVal = document.getElementById('status-filter')?.value || '';

  // Use cached data to avoid re-fetching for simple filters
  filteredBookings = allBookings.filter(b => {
    const statusMatch = !statusVal || b.status === statusVal;
    const searchMatch = !searchQuery ||
      b.clientName.toLowerCase().includes(searchQuery) ||
      b.email.toLowerCase().includes(searchQuery) ||
      (b.eventName && b.eventName.toLowerCase().includes(searchQuery));
    return statusMatch && searchMatch;
  });
  currentPage = 1;
  renderBookingsTable(filteredBookings);
}

function openNewBookingModal() {
  document.getElementById('new-booking-modal-title').textContent = 'New Booking';
  document.getElementById('booking-edit-id').value = '';
  ['bk-client-name','bk-client-email','bk-event-type','bk-event-date','bk-venue','bk-budget','bk-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  openModal('modal-new-booking');
}

function editBooking(id) {
  const b = allBookings.find(bk => String(bk.id) === String(id));
  if (!b) return;
  document.getElementById('new-booking-modal-title').textContent = 'Edit Booking';
  document.getElementById('booking-edit-id').value = id;
  document.getElementById('bk-client-name').value = b.clientName;
  document.getElementById('bk-client-email').value = b.email;
  document.getElementById('bk-event-type').value = b.eventType;
  document.getElementById('bk-event-date').value = b.eventDate;
  document.getElementById('bk-venue').value = b.venue || '';
  document.getElementById('bk-budget').value = b.budget || '';
  document.getElementById('bk-notes').value = b.theme || '';
  openModal('modal-new-booking');
}

function viewBooking(id) {
  const b = allBookings.find(bk => String(bk.id) === String(id));
  if (!b) return;
  const contentEl = document.getElementById('view-booking-content');
  contentEl.innerHTML = `
    <div class="view-detail-grid">
      <div class="detail-item"><label>Booking Name</label><span>${b.eventName}</span></div>
      <div class="detail-item"><label>Client Name</label><span>${b.clientName}</span></div>
      <div class="detail-item"><label>Email Address</label><span>${b.email}</span></div>
      <div class="detail-item"><label>Phone</label><span>${b.phone || 'N/A'}</span></div>
      <div class="detail-item"><label>Event Type</label><span>${b.eventType}</span></div>
      <div class="detail-item"><label>Date From</label><span>${formatDate(b.eventDate)}</span></div>
      <div class="detail-item"><label>Date To</label><span>${b.dateTo ? formatDate(b.dateTo) : 'N/A'}</span></div>
      <div class="detail-item"><label>Guests</label><span>${b.guests || 'N/A'}</span></div>
      <div class="detail-item"><label>Venue</label><span>${b.venue || 'TBD'}</span></div>
      <div class="detail-item"><label>Theme</label><span>${b.theme || 'N/A'}</span></div>
      <div class="detail-item"><label>Budget</label><span>${b.budget ? '₱' + Number(b.budget).toLocaleString() : 'Not set'}</span></div>
      <div class="detail-item full-width"><label>Current Status</label><div>${statusBadge(b.status)}</div></div>
      <div class="detail-item"><label>Created</label><span>${b.createdAt || 'N/A'}</span></div>
      <div class="detail-item"><label>Last Updated</label><span>${b.updatedAt || 'N/A'}</span></div>
    </div>
  `;
  openModal('modal-view-booking');
}

async function saveBooking() {
  const valid = validateForm([
    { id: 'bk-client-name', msg: 'Client name required.' },
    { id: 'bk-client-email', msg: 'Client email required.' },
    { id: 'bk-event-date', msg: 'Event date required.' }
  ]);
  if (!valid) return;

  const id = document.getElementById('booking-edit-id').value;
  const data = {
    name: document.getElementById('bk-client-name').value.trim(),
    email: document.getElementById('bk-client-email').value.trim(),
    type: document.getElementById('bk-event-type').value.trim() || 'General Event',
    date_from: document.getElementById('bk-event-date').value,
    venue: document.getElementById('bk-venue').value.trim(),
    budget: document.getElementById('bk-budget').value ? parseFloat(document.getElementById('bk-budget').value) : null,
    theme: document.getElementById('bk-notes').value.trim()
  };

  if (id) {
    await window.useBookings.updateBooking(id, data);
    showToast(`Booking updated successfully.`);
  } else {
    // For new bookings from admin, use the existing add_booking endpoint
    showToast(`Use the client booking form to create new bookings.`, 'error');
    return;
  }
  closeModal('modal-new-booking');
  await loadBookings();
}

function confirmCancelBooking(id) {
  const b = allBookings.find(bk => String(bk.id) === String(id));
  if (!b) return;
  document.getElementById('cancel-confirm-msg').innerHTML = `Are you sure you want to reject the booking for <strong style="color:var(--jazz-gold)">${b.clientName}</strong>? This action will set the status to Rejected.`;
  const confirmBtn = document.getElementById('confirm-cancel-btn');
  confirmBtn.onclick = async () => {
    await window.useBookings.changeStatus(id, 'REJECTED');
    showToast('Booking has been rejected.');
    closeModal('modal-cancel-booking');
    await loadBookings();
  };
  openModal('modal-cancel-booking');
}

function statusBadge(status) {
  const map = {
    PENDING: 'status-pending',
    ACCEPTED: 'status-confirmed',
    REJECTED: 'status-cancelled'
  };
  const cls = map[status] || 'status-pending';
  return `<span class="status-pill ${cls}">${status}</span>`;
}

function debounce(fn, ms) {
  let timer;
  return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), ms); };
}

// Global functions for onclick handlers
window.viewBooking = viewBooking;
window.editBooking = editBooking;
window.confirmCancelBooking = confirmCancelBooking;
window.changeBookingPage = changeBookingPage;
window.saveBooking = saveBooking;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Populate sidebar avatar
  const user = await DB.getUser();
  if (user) {
    var words = user.name.trim().split(/\s+/);
    var initials = words.map(function(w){ return w[0]; }).join('').toUpperCase().substring(0,2);
    const pfp = document.getElementById('profile-avatar-initials');

    document.getElementById('sidebar-name').textContent = user.name;
    if (user.profile_picture) {
      pfp.innerHTML = '<img src="' + user.profile_picture + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
      document.getElementById('sidebar-avatar').innerHTML = '<img src="' + user.profile_picture + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
    } else {
      pfp.textContent = initials;
      document.getElementById('sidebar-avatar').textContent = initials;
    }
  }

  await initBookingsPage();
});
