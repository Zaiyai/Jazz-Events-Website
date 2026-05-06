const today = new Date().toISOString().split('T')[0];
document.getElementById('datefrom').setAttribute('min', today);
document.getElementById('dateto').setAttribute('min', today);

const eventBudget = document.getElementById('event-budget');

const attendees = document.getElementById('attendees');

function updateEstimatedBudget() {
    if (attendees.value > 99999) {
        eventBudget.innerHTML = "Too many guests";
    } else if (attendees.value < 1) {
        eventBudget.innerHTML = "Too little guests";
    } else {
        let servicesChecked = document.querySelectorAll('input[type="checkbox"]:checked').length;
        let totalBudget = 1000 * servicesChecked * attendees.value
        eventBudget.innerHTML = totalBudget.toLocaleString();
    }
}

// On form submission
function submitForm() {
    const content = eventBudget.innerHTML;
    document.getElementById('budget').value = content;

    let bookingInfo = {
        email: document.getElementById('email').value.trim(),
        name: document.getElementById('name').value.trim(),
        type: document.getElementById('type').value.trim(),
        date_from: document.getElementById('datefrom').value,
        date_to: document.getElementById('dateto').value,
        no_of_guests: document.getElementById('attendees').value.trim(),
        venue: document.getElementById('venue').value.trim(),
        theme: document.getElementById('theme').value.trim(),
        status: 'PENDING',
        budget: document.getElementById('budget').value.trim(),
        personal_request: document.getElementById('personal_request').value.trim(),
    };

    DB.createBooking(bookingInfo);
};

