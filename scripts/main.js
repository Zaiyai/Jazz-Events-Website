function handleProfileLogout() {
  DB.logout();
}

function bookingRedirect() {
  if (COOKIES.hasEmail()) {
    window.location.href = "booking/booking.html";
  } else {
    displayLogin(true);
  }
}

function displayLogin(bookingRedirect = false) {
  let loginBtn = document.getElementById("login-submit-btn");
  loginBtn.onclick = () => {
    handleLogin(bookingRedirect ? true : false);
  };

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
  const urlParams = new URLSearchParams(window.location.search);
    
  if (urlParams.get('showLogin') === 'true') {
      displayLogin();
      
      // Optional: Clean the URL so the popup doesn't reappear if they refresh
      window.history.replaceState({}, document.title, window.location.pathname);
  }
});