function handleProfileLogout() {
  DB.logout();
}

function displayLogin() {
  document.getElementsByClassName('auth-section')[0].style.display = "block";
}

const fullPath = window.location.pathname;
const lastSlashIndex = fullPath.lastIndexOf('/');
const fileName = fullPath.substring(lastSlashIndex + 1);

var logoPath = "assets/Jazz.svg";
var decorPath = "assets/decor/gold_accent.png";

if (fileName != "home.html") {
    logoPath = "../" + logoPath;
    decorPath = "../" + decorPath;
}

document.querySelectorAll(".logo").forEach(logo => { logo.src = logoPath; });
document.querySelectorAll(".gold_accent").forEach(accent => { accent.src = decorPath; });

// Mobile Burger Menu
const burger   = document.getElementById("burger");
const overlay  = document.getElementById("nav-overlay");
const closeBtn = document.getElementById("close-overlay");

/* RESIZE SAFETY */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});

document.addEventListener('DOMContentLoaded', async () => {
  var slot = document.getElementById('nav-auth-slot');

  if (COOKIES.hasEmail()) {
    if (COOKIES.getCookie("user_type") == 'ADMIN') {
      const navLinks = document.getElementsByClassName('nav-links')[0];
      
      navLinks.innerHTML = 
        '<a href="/Jazz%20Events%20Website/dashboard/dashboard.html" style="color: #d4af37;">ADMIN PANEL</a>' +
        '<span style="color: #333; margin: 0 10px;">|</span>' +
        '<a href="../home.html">Home</a>' +
        '<a href="../home.html#services-section">Services</a>' +
        '<a href="../home.html#team-section">Team</a>' +
        '<a href="../home.html#reviews-section">Reviews</a>' +
        '<a href="../home.html#about">About Us</a>' +
        '<a href="../home.html#cta-section">Contact</a>';
    } 
    // Build profile avatar + dropdown for regular users
    slot.innerHTML =
      '<div class="profile-menu-wrap" id="profile-menu-wrap">' +
        '<button class="profile-avatar-btn" id="profile-avatar-btn" title="My Account">' +
          '<span class="profile-avatar-initials" id="profile-avatar-initials"><i class="fa-regular fa-user"></i></span>' +
        '</button>' +
        '<div class="profile-dropdown" id="profile-dropdown">' +
          '<div class="profile-dropdown-header">' +
            '<div class="profile-dropdown-avatar" id="profile-dropdown-avatar"><i class="fa-regular fa-user"></i></div>' +
            '<div class="profile-dropdown-name" id="profile-dropdown-name">My Account</div>' +
          '</div>' +
          '<div class="profile-dropdown-divider"></div>' +
          '<a href="booking/client_bookings.html" class="profile-dropdown-item">' +
            '<i class="fa-regular fa-calendar"></i> Bookings' +
          '</a>' +
          '<a href="settings/settings-profile.html" class="profile-dropdown-item">' +
            '<i class="fa-solid fa-sliders"></i> Settings' +
          '</a>' +
          '<div class="profile-dropdown-divider"></div>' +
          '<button class="profile-dropdown-logout" onclick="handleProfileLogout()">' +
            '<i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out' +
          '</button>' +
        '</div>' +
      '</div>';

      // Fetch user info and populate name + initials
      DB.getUser().then(function(user) {
        if (user && user.name) {
          var words = user.name.trim().split(/\s+/);
          var initials = words.map(function(w){ return w[0]; }).join('').toUpperCase().substring(0,2);
          document.getElementById('profile-avatar-initials').textContent = initials;
          document.getElementById('profile-dropdown-avatar').textContent = initials;
          document.getElementById('profile-dropdown-name').textContent = user.name;
        }
      });

      // Toggle dropdown on avatar click
      document.getElementById('profile-avatar-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('profile-dropdown').classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        var dd = document.getElementById('profile-dropdown');
        if (dd && !document.getElementById('profile-menu-wrap').contains(e.target)) {
            dd.classList.remove('open');
        }
    });

  // No Accounts Registered
  } else {
      slot.innerHTML ='<a onclick="displayLogin()" class="btn-nav-login">LOG IN</a>';
  }

  await Promise.all([
    loadBookings()
  ]);
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