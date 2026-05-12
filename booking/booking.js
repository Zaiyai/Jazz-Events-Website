const dateFrom = document.getElementById('datefrom');
const dateTo   = document.getElementById('dateto');
const today = new Date().toISOString().split('T')[0];
const eventBudget  = document.getElementById('event-budget');
const attendees    = document.getElementById('attendees');
const attendeesErr = document.getElementById('attendees-err')

if (dateFrom && dateTo) {
    dateFrom.setAttribute('min', today);
    dateTo.setAttribute('min', today);
}

var bookingInfo;

// On date change
function checkDateViability(date) {
    const dateErr = date.parentElement.nextElementSibling;
    
    const dateFromErr = document.getElementById('datefrom-err');
    const dateToErr   = document.getElementById('dateto-err');
    
    // If dateFrom is greater than dateTo
    if (dateFrom.value > dateTo.value) {
        dateFromErr.innerHTML = "Cannot be after event end";
        dateToErr.innerHTML   = "Cannot be before event start";
        dateFromErr.classList.add('show');
        dateToErr.classList.add('show');
        return;
    } else {
        dateFromErr.classList.remove('show');
        dateToErr.classList.remove('show');
    }
    
    if (date.value < today) {
        dateErr.innerHTML = "Cannot be before today";
        dateErr.classList.add('show');
        return;
    }

    dateErr.classList.remove('show');
}

// On number of guests change
function updateEstimatedBudget() {
    let totalBudget = 0;

    if (attendees.value > 99999) {
        eventBudget.innerHTML  = "Too many guests";
        attendeesErr.innerHTML = "Too many guests";
        attendeesErr.classList.add('show');
        return;
    } else if (attendees.value < 1) {
        eventBudget.innerHTML  = "Too little guests";
        attendeesErr.innerHTML = "Too little guests";
        attendeesErr.classList.add('show');
        return;
    } 

    attendeesErr.classList.remove('show');
    let servicesChecked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    totalBudget = 1000 * servicesChecked * attendees.value
    eventBudget.innerHTML = totalBudget.toLocaleString() + ".00";
}

function validate(id,errId) {
  const el = document.getElementById(id), err = document.getElementById(errId); 
  const empty =! el ?.value.trim();
  el ?.classList.toggle('has-error',empty);
  err ?.classList.toggle('show',empty);
  return !empty;
}

// Before checking of summary
async function firstSubmit() {
    const ok = [
        validate('name','name-err'),
        validate('type','type-err'), 
        validate('datefrom','datefrom-err'),
        validate('dateto','dateto-err'),
        validate('attendees','attendees-err'),
        validate('venue','venue-err'),
        validate('theme','theme-err')].every(Boolean);
        
    if (!ok) return;
    
    const submitBtn = document.getElementById('submit');
    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;
    
    const content = eventBudget.innerHTML;
    document.getElementById('budget').value = content;
    
    const user = await DB.getUser();
    
    bookingInfo = {
        name:         document.getElementById('name').value.trim(),
        email:        document.getElementById('email').value.trim() || user.email,
        type:         document.getElementById('type').value.trim(),
        client_id:    user.user_id,
        client_name:  user.name,
        date_from:    dateFrom.value,
        date_to:      dateTo.value,
        no_of_guests: attendees.value.trim(),
        venue:        document.getElementById('venue').value.trim(),
        theme:        document.getElementById('theme').value.trim(),
        status:       'PENDING',
        budget:       document.getElementById('budget').value.trim(),
        phone_number: document.getElementById('phone').value.trim()
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingInfo));
    window.location.href = "booking_summary.html";
}

// On form actual submission
function submitBooking() {
    const submitBtn = document.getElementsByClassName('confirm-btn')[0];
    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;
    DB.createBooking(JSON.parse(sessionStorage.getItem('bookingData'))); 
    sessionStorage.removeItem('bookingData');
};

document.addEventListener('DOMContentLoaded', () => {
    updateEstimatedBudget();
});