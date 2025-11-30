const backgrounds = document.querySelectorAll('.hero-img');

const availableBackgrounds = [
    'images/hero backgrounds/catering.jpg', 'images/hero backgrounds/debut.jpg', 'images/hero backgrounds/img1.jpg', 'images/hero backgrounds/the_crew.jpg'
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
            background.src = availableBackgrounds[index];
            background.style.opacity = 1;
        }, 600)
    }, 3000);
}