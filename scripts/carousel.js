const backgrounds = document.querySelectorAll('.hero-img');

const availableBackgrounds = [
    'catering.jpg', 'debut.jpg', 'img1.jpg', 'the_crew.jpg'
]

backgrounds.forEach(background => {
    cycleBackgrounds(background);
});

function cycleBackgrounds(background) {
    let index = 1;

    setInterval(() => {
        background.style.opacity = 0;

        setTimeout(() => {
            index = (index + 1) % availableBackgrounds.length;
            background.src = 'assets/hero backgrounds/' +availableBackgrounds[index];
            background.style.opacity = 1;
        }, 600)
    }, 3000);
}