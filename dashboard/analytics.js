// analytics.js – Logic and Chart initialization for Analytics tab

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

  initAnalytics();
});

function initAnalytics() {
  initRevenueChart();
  initEventTypesChart();
  initBookingsChart();
  renderTopEventsTable();
}

function initRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [150000, 185000, 210000, 280000, 320000, 390000],
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
          ticks: { color: '#666', font: { size: 10 }, callback: val => '₱' + (val/1000) + 'k' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#666', font: { size: 10 } }
        }
      }
    }
  });
}

function initEventTypesChart() {
  const ctx = document.getElementById('eventTypesChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Corporate', 'Weddings', 'Private'],
      datasets: [{
        data: [45, 32, 23],
        backgroundColor: ['#d4af37', '#e2c87b', '#333'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      cutout: '75%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  const legendEl = document.getElementById('pieLegend');
  const colors = ['#d4af37', '#e2c87b', '#333'];
  const labels = ['Corporate', 'Weddings', 'Private'];
  const values = ['45%', '32%', '23%'];

  legendEl.innerHTML = labels.map((label, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span>${label}</span>
      </div>
      <span class="legend-value">${values[i]}</span>
    </div>
  `).join('');
}

function initBookingsChart() {
  const ctx = document.getElementById('bookingsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Completed Events',
          data: [45, 85, 60, 90, 70, 110],
          backgroundColor: '#d4af37',
          borderRadius: 2,
          barThickness: 40
        },
        {
          label: 'Total Bookings',
          data: [35, 10, 35, 5, 20, 5], // Difference to make stack match screenshot
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

function renderTopEventsTable() {
  const events = [
    {
      name: 'Golden Anniversary Gala',
      type: 'Corporate Dinner - 120 Guests',
      date: 'December 20, 2026',
      revenue: '₱380,000',
      satisfaction: '98%',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Garden Wedding',
      type: 'Wedding - 200 Guests',
      date: 'July 15, 2026',
      revenue: '₱738,500',
      satisfaction: '99%',
      img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: "New Year's Executive Retreat",
      type: 'Corporate - 50 Guests',
      date: 'October 2, 2025',
      revenue: '₱450,900',
      satisfaction: '91%',
      img: 'https://images.unsplash.com/photo-1530103862676-de88d660f9dd?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: '50th Birthday Celebration',
      type: 'Private Party - 80 Guests',
      date: 'November 20, 2026',
      revenue: '₱329,000',
      satisfaction: '89%',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=100&q=80'
    }
  ];

  const tbody = document.getElementById('top-events-tbody');
  tbody.innerHTML = events.map(ev => `
    <tr>
      <td>
        <div class="event-details-cell">
          <img src="${ev.img}" class="event-thumb">
          <div class="event-info-text">
            <h4>${ev.name}</h4>
            <p>${ev.type}</p>
          </div>
        </div>
      </td>
      <td>${ev.date}</td>
      <td style="color:var(--text-white); font-weight:600;">${ev.revenue}</td>
      <td><span class="satisfaction-high">${ev.satisfaction}</span></td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', initAnalytics);
