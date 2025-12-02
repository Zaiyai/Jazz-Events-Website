const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('search-content');

const availableSuggestions = ['Home', 'Service', 'Reviews', 'Crew', 'About', 'Contact', 'Catering', 'Quotation', 'Facebook Link', 'Privacy Policy', 'Cookie Policy', 'Terms of Service'];

searchInput.addEventListener('input', function() {
    const inputValue = this.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (inputValue.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }

    const filteredSuggestions = availableSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue)
    );

    if (filteredSuggestions.length > 0) {
        filteredSuggestions.forEach((suggestion, index, array) => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion;

            if (filteredSuggestions.length === 1) { suggestionsList.style.padding = "5px 16px"; }
            if (index === array.length - 1) { listItem.style.borderBottom = "none"; }

            
            listItem.addEventListener('click', function() {
                searchInput.value = "";
                suggestionsList.style.display = 'none';
                
                switch (suggestion) {
                    case 'Home':
                        window.scrollTo(0, 0);
                        break;
                    case 'Service':
                        document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 'Reviews':
                        document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 'Crew':
                        location.replace('crew/crew.html')
                        break;
                    case 'About':
                        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 'Catering':
                        break;
                    case 'Quotation':
                        break;
                    case 'Facebook Link':
                        window.open('https://www.facebook.com/profile.php?id=61572991510337', '_blank');
                        break;
                    case 'Privacy Policy':
                        break;
                    case 'Cookie Policy':
                        break;
                    case 'Terms of Service':
                        break;
                }
            });
            suggestionsList.appendChild(listItem);
        });
        suggestionsList.style.display = 'block';
    } else {
        suggestionsList.style.display = 'none';
    }
});

// Hide suggestions when clicking outside the search box
document.addEventListener('click', function(event) {
    if (!event.target.closest('.search-container')) {
        suggestionsList.style.display = 'none';
    }
});