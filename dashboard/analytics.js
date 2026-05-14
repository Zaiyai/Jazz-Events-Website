// analytics.js – Logic and Chart initialization for Analytics tab
// Fetches all data from the database via analytics.php

let analyticsData = null;
let topEventsPage = 1;
const topEventsPerPage = 4;

// Initialize page on load
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

  await initAnalytics();
});

async function fetchAnalyticsData() {
  try {
    const response = await fetch('../scripts/events/analytics.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('HTTP error: ' + response.status);
    const data = await response.json();
    if (data.ok) {
      return data;
    }
    console.warn('Analytics fetch returned not ok:', data);
    return null;
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return null;
  }
}

async function initAnalytics() {
  analyticsData = await fetchAnalyticsData();
  if (!analyticsData) {
    console.warn('No analytics data available, charts will be empty.');
    analyticsData = {
      stats: { total_revenue: 0, total_events: 0, avg_event_value: 0, total_clients: 0, total_bookings: 0, completed_events: 0 },
      event_types: [],
      booking_types: [],
      monthly_revenue: [],
      monthly_bookings: [],
      monthly_completed: [],
      top_events: []
    };
  }

  renderStatsCards();
  initRevenueChart();
  initEventTypesChart();
  initBookingsChart();
  renderTopEventsTable();
}

/* ── Stats Cards ──────────────────────────────────────────── */
function renderStatsCards() {
  const s = analyticsData.stats;

  // Total Revenue
  const v1 = document.getElementById('an-val-1');
  const s1 = document.getElementById('an-sub-1');
  if (v1) v1.textContent = formatPesoCompact(s.total_revenue);
  if (s1) s1.innerHTML = '<i class="fa-solid fa-chart-bar"></i> From ' + s.total_events + ' events';

  // Total Clients
  const v2 = document.getElementById('an-val-2');
  const s2 = document.getElementById('an-sub-2');
  if (v2) v2.textContent = s.total_clients;
  if (s2) s2.innerHTML = '<i class="fa-solid fa-users"></i> Registered clients';

  // Avg Event Value
  const v3 = document.getElementById('an-val-3');
  const s3 = document.getElementById('an-sub-3');
  if (v3) v3.textContent = formatPesoCompact(s.avg_event_value);
  if (s3) s3.innerHTML = '<i class="fa-solid fa-calculator"></i> Per event average';

  // Completion Rate
  const v4 = document.getElementById('an-val-4');
  const s4 = document.getElementById('an-sub-4');
  if (v4) {
    const pct = s.total_events > 0 ? ((s.completed_events / s.total_events) * 100).toFixed(1) : '0.0';
    v4.textContent = pct + '%';
  }
  if (s4) s4.innerHTML = '<i class="fa-solid fa-check-circle"></i> ' + s.completed_events + ' of ' + s.total_events + ' events';
}

function formatPesoCompact(val) {
  val = parseFloat(val) || 0;
  return '₱' + val.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/* ── Revenue Chart ────────────────────────────────────────── */
function initRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

  const monthlyData = analyticsData.monthly_revenue;
  const labels = monthlyData.length > 0 ? monthlyData.map(m => m.month_label) : ['—'];
  const values = monthlyData.length > 0 ? monthlyData.map(m => parseFloat(m.revenue)) : [0];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: values,
        borderColor: '#d4af37',
        borderWidth: 2,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#d4af37',
        pointBorderColor: '#1a1a1a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
          ticks: { color: '#666', font: { size: 10 }, callback: val => '₱' + (val >= 1000 ? (val/1000).toFixed(0) + 'k' : val) }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#666', font: { size: 10 } }
        }
      }
    }
  });
}

/* ── Event Types Doughnut ─────────────────────────────────── */
async function initEventTypesChart() {
  const canvas = document.getElementById('eventTypesChart');
  if (!canvas) return;

  // Fetch events directly from the database, same as dashboard
  const events = await getData('events');

  // Count types from actual event data
  const counts = {};
  if (Array.isArray(events)) {
    events.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
  }
  const total = Array.isArray(events) ? events.length : 0;

  // Dynamic color palette for all event types
  const colorPalette = ['#d4af37', '#f0d78c', '#7a6020', '#b8860b', '#daa520', '#cd853f', '#8b4513', '#a0522d'];

  const labels = Object.keys(counts).sort();
  const values = labels.map(type => counts[type]);
  const colors = labels.map((_, i) => colorPalette[i % colorPalette.length]);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets: [{
        data: values.length > 0 ? values : [1],
        backgroundColor: labels.length > 0 ? colors : ['#333'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          borderColor: '#d4af37',
          borderWidth: 1,
          titleColor: '#d4af37',
          bodyColor: '#e5e7eb',
          padding: 10,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const pct = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
              return ` ${context.label}: ${context.parsed} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  // Render legend
  const legendEl = document.getElementById('pieLegend');
  if (labels.length > 0) {
    legendEl.innerHTML = labels.map((label, i) => {
      const pct = total > 0 ? Math.round((values[i] / total) * 100) : 0;
      return `
        <div class="legend-item">
          <div class="legend-left">
            <div class="legend-dot" style="background:${colors[i]}"></div>
            <span>${label} (${values[i]})</span>
          </div>
          <span class="legend-value">${pct}%</span>
        </div>
      `;
    }).join('');
  } else {
    legendEl.innerHTML = '<div class="legend-item"><span style="color:#666;">No event data</span></div>';
  }
}

/* ── Bookings Bar Chart ───────────────────────────────────── */
function initBookingsChart() {
  const ctx = document.getElementById('bookingsChart').getContext('2d');

  const bookingsData = analyticsData.monthly_bookings;
  const completedData = analyticsData.monthly_completed;

  // Merge month keys from both datasets
  const allMonthKeys = new Map();
  bookingsData.forEach(m => allMonthKeys.set(m.month_key, m.month_label));
  completedData.forEach(m => allMonthKeys.set(m.month_key, m.month_label));

  // Sort by month_key
  const sortedMonths = Array.from(allMonthKeys.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const labels = sortedMonths.length > 0 ? sortedMonths.map(m => m[1]) : ['—'];
  const monthKeys = sortedMonths.map(m => m[0]);

  // Build lookup maps
  const bookingsMap = {};
  bookingsData.forEach(m => { bookingsMap[m.month_key] = parseInt(m.total_bookings); });
  const completedMap = {};
  completedData.forEach(m => { completedMap[m.month_key] = parseInt(m.completed); });

  const bookingsValues = monthKeys.map(k => bookingsMap[k] || 0);
  const completedValues = monthKeys.map(k => completedMap[k] || 0);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Completed Events',
          data: completedValues,
          backgroundColor: '#d4af37',
          borderRadius: 2,
          barThickness: 40
        },
        {
          label: 'Total Bookings',
          data: bookingsValues,
          backgroundColor: '#333',
          borderRadius: 2,
          barThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          position: 'top',
          align: 'start',
          labels: { color: '#9ca3af', boxWidth: 10, font: { size: 9 } } 
        } 
      },
      scales: {
        y: {
          stacked: true,
          grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
          ticks: { color: '#666', font: { size: 10 } }
        },
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#666', font: { size: 10 } }
        }
      }
    }
  });
}

/* ── Top Events Table ─────────────────────────────────────── */
function renderTopEventsTable() {
  const allEvents = analyticsData.top_events || [];
  const totalEvents = allEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalEvents / topEventsPerPage));

  if (topEventsPage > totalPages) topEventsPage = totalPages;
  if (topEventsPage < 1) topEventsPage = 1;

  const start = (topEventsPage - 1) * topEventsPerPage;
  const pageEvents = allEvents.slice(start, start + topEventsPerPage);

  const tbody = document.getElementById('top-events-tbody');

  // Image map based on event type
  const imageMap = {
    'Wedding': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=100&q=80',
    'Birthday': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=100&q=80',
    'Conference': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=100&q=80',
    'Debut': 'https://images.unsplash.com/photo-1530103862676-de88d660f9dd?auto=format&fit=crop&w=100&q=80',
    'Gala': 'https://images.unsplash.com/photo-1620663479979-994191d8bb71?auto=format&fit=crop&w=100&q=80',
  };
  const defaultImg = 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=100&q=80';

  if (pageEvents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:28px;color:#666;">No events found</td></tr>';
  } else {
    tbody.innerHTML = pageEvents.map(ev => {
      const img = imageMap[ev.type] || defaultImg;
      const eventDate = new Date(ev.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const formattedRevenue = '₱' + parseFloat(ev.amount).toLocaleString('en-PH');
      const typeLabel = ev.type + ' - ' + ev.no_of_guests + ' Guests';
      const statusClass = ev.status === 'COMPLETED' ? 'satisfaction-high' : 'satisfaction-med';
      return `
        <tr>
          <td>
            <div class="event-details-cell">
              <img src="${img}" class="event-thumb">
              <div class="event-info-text">
                <h4>${ev.name}</h4>
                <p>${typeLabel}</p>
              </div>
            </div>
          </td>
          <td>${formattedDate}</td>
          <td style="color:var(--text-white); font-weight:600;">${formattedRevenue}</td>
          <td><span class="${statusClass}">${ev.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  // Update footer count
  const countEl = document.getElementById('table-count');
  if (countEl) {
    if (totalEvents === 0) {
      countEl.textContent = 'No events';
    } else {
      const showStart = start + 1;
      const showEnd = Math.min(start + topEventsPerPage, totalEvents);
      countEl.textContent = `Showing ${showStart}–${showEnd} of ${totalEvents} events`;
    }
  }

  // Update pagination buttons
  renderTopEventsPagination(totalPages);
}

function renderTopEventsPagination(totalPages) {
  const paginationEl = document.querySelector('.table-footer-analytics .pagination');
  if (!paginationEl) return;

  paginationEl.innerHTML = `
    <button class="pg-btn" onclick="changeTopEventsPage(${topEventsPage - 1})" ${topEventsPage <= 1 ? 'disabled' : ''}>Previous</button>
    ${Array.from({length: totalPages}, (_, i) =>
      `<button class="pg-btn ${i+1 === topEventsPage ? 'active' : ''}" onclick="changeTopEventsPage(${i+1})">${i+1}</button>`
    ).join('')}
    <button class="pg-btn" onclick="changeTopEventsPage(${topEventsPage + 1})" ${topEventsPage >= totalPages ? 'disabled' : ''}>Next</button>
  `;
}

function changeTopEventsPage(page) {
  const totalEvents = (analyticsData.top_events || []).length;
  const totalPages = Math.max(1, Math.ceil(totalEvents / topEventsPerPage));
  if (page < 1 || page > totalPages) return;
  topEventsPage = page;
  renderTopEventsTable();
}

// Expose pagination to inline onclick
window.changeTopEventsPage = changeTopEventsPage;
