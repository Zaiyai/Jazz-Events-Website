function handleProfileLogout() {
  DB.logout();
}

function bookingRedirect() {
  if (COOKIES.hasEmail()) {
    window.location.href = "booking/booking.html";
  } else {
    displayLogin();
  }
}

function displayLogin() {
document.getElementsByClassName('auth-section')[0].style.display = "block";
}

// Read More functionality for reviews
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.review-card');
        card.classList.toggle('expanded');
        
        if (card.classList.contains('expanded')) {
            this.innerHTML = 'Read Less <i class="fa-solid fa-chevron-up"></i>';
        } else {
            this.innerHTML = 'Read More <i class="fa-solid fa-chevron-down"></i>';
        }
    });
});

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

/* OPEN */
burger.addEventListener("click", () => {
  if (window.innerWidth > 768) return;

  overlay.classList.add("open");
  document.body.classList.add("menu-open");
  burger.setAttribute("aria-expanded", "true");
});

/* CLOSE BUTTON */
closeBtn.addEventListener("click", closeMenu);

/* CLOSE ON LINK CLICK */
overlay.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

/* ESC KEY */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMenu();
});

/* RESIZE SAFETY */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});

function closeMenu() {
  overlay.classList.remove("open");
  document.body.classList.remove("menu-open");
  burger.setAttribute("aria-expanded", "false");
}

const eyeBtn = document.getElementsByClassName('eye-btn')[0];

function togglePass(inputId, eyecon) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';

  if (eyecon.innerHTML == '<i class="fa-regular fa-eye"></i>') {
    eyecon.innerHTML = '<i class="fa-regular fa-eye-slash"></i>'
  } else {
    eyecon.innerHTML = '<i class="fa-regular fa-eye"></i>'
  }
}

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
});