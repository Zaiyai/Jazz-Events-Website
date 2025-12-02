var bookBtn = document.getElementsByClassName("bookBtn");

for(i = 0; i < bookBtn.length; i++) {
    bookBtn[i].addEventListener("click", () => {
        window.location.href = "booking/booking.html";
    })
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
