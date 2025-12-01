const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('search-content');

const availableSuggestions = ['Home', 'Service', "Clients' Reviews", 'Crew', 'About', 'Contact', 'Catering', 'Quotation', 'Facebook Link', 'Privacy Policy', 'Cookie Policy', 'Terms of Service'];

searchInput.addEventListener('input', function() {
    const inputValue = this.value.toLowerCase();
    suggestionsList.innerHTML = ''; // Clear previous suggestions

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
                    case "Clients' Reviews":
                        document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
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