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