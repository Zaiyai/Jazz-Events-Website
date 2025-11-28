const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('search-content');

const availableSuggestions = ['Service', 'Crew', 'About', 'Contact', "Clients' Reviews", 'Gallery', 'Catering', 'Quotation', 'Facebook Link', 'Privacy Policy', 'Cookie Policy', 'Terms of Service'];

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
        filteredSuggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion;
            listItem.addEventListener('click', function() {
                searchInput.value = this.textContent;
                suggestionsList.style.display = 'none';
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