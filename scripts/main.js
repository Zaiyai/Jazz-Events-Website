function handleProfileLogout() {
  DB.logout();
}

function bookingRedirect() {
  if (COOKIES.hasEmail()) {
    // Determine correct relative path to booking page based on current depth
    var path = window.location.pathname;
    if (path.indexOf('/services/') !== -1 || path.indexOf('/booking/') !== -1 || path.indexOf('/login/') !== -1 || path.indexOf('/register/') !== -1 || path.indexOf('/dashboard/') !== -1 || path.indexOf('/staff/') !== -1 || path.indexOf('/settings/') !== -1 || path.indexOf('/policies/') !== -1) {
      window.location.href = "../booking/booking.html";
    } else {
      window.location.href = "booking/booking.html";
    }
  } else {
    displayLogin(true);
  }
}

function displayLogin(bookingRedirect = false) {
  const authSection = document.getElementsByClassName('auth-section')[0];
  
  if (authSection) {
    let loginBtn = document.getElementById("login-submit-btn");
    if (loginBtn) {
      loginBtn.onclick = () => {
        handleLogin(bookingRedirect ? true : false);
      };
    }
    authSection.style.display = "block";
  } else {
    // Redirect to home if login modal is not on this page
    const homeUrl = window.location.hostname === "localhost" ? "/Jazz%20Events%20Website/home.html" : "../home.html";
    window.location.href = homeUrl + "?showLogin=true" + (bookingRedirect ? "&bookingRedirect=true" : "");
  }
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
  document.addEventListener("click", (e) => {
    // OPEN BURGER
    const burger = e.target.closest("#burger");
    if (burger) {
      if (window.innerWidth >= 768) return;
      const overlay = document.getElementById("nav-overlay");
      if (overlay) {
        overlay.classList.add("open");
        document.body.classList.add("menu-open");
        burger.setAttribute("aria-expanded", "true");
      }
    }

    // CLOSE BUTTON
    const closeBtn = e.target.closest("#close-overlay");
    if (closeBtn) {
      closeMenu();
    }

    // CLOSE ON LINK CLICK
    const overlay = document.getElementById("nav-overlay");
    if (overlay && overlay.contains(e.target) && e.target.closest("a")) {
      closeMenu();
    }
  });

  /* ESC KEY */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

  /* RESIZE SAFETY */
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });

  function closeMenu() {
    const overlay = document.getElementById("nav-overlay");
    if (overlay) overlay.classList.remove("open");
    document.body.classList.remove("menu-open");
    const burger = document.getElementById("burger");
    if (burger) burger.setAttribute("aria-expanded", "false");
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
      
      // Clean the URL so the popup doesn't reappear if they refresh
      window.history.replaceState({}, document.title, window.location.pathname);
  }
});