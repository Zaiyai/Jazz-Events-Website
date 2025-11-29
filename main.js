var bookBtn = document.getElementsByClassName("bookBtn");

for(i = 0; i < bookBtn.length; i++) {
    bookBtn[i].addEventListener("click", () => {
        window.location.href = "booking/booking_landing.html";
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

