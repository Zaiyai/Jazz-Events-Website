const attendees = document.getElementById('attendees');

function updateEstimatedBudget() {
    let servicesChecked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    document.getElementById('event-budget').innerHTML = 1000 * servicesChecked * attendees.value;
}