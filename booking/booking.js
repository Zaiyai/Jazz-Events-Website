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