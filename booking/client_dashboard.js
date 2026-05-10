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
  // If Email Cookie Found
  var slot = document.getElementById('nav-auth-slot');

  if (COOKIES.hasEmail()) {
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
  } else {
      window.location.href = "../home.html";
  }
});