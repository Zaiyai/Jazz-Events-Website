var bookBtn = document.getElementsByClassName("bookBtn");

for(i = 0; i < bookBtn.length; i++) {
    bookBtn[i].addEventListener("click", () => {
        window.location.href = "booking/booking_landing.html";
    })
}