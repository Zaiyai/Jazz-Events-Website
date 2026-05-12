const today = new Date().toISOString().split('T')[0];
const eventBudget  = document.getElementById('event-budget');
const attendees    = document.getElementById('attendees');
const attendeesErr = document.getElementById('attendees-err');
const dateFrom     = document.getElementById('datefrom');
const dateTo       = document.getElementById('dateto');

var fp; // Global scope for accessibility

document.addEventListener('DOMContentLoaded', function() {
    const daterangeEl = document.getElementById('daterange');
    if (!daterangeEl) {
        console.error("Daterange element not found!");
        return;
    }

    if (typeof flatpickr === 'undefined') {
        console.error("Flatpickr library not loaded!");
        return;
    }

    // Initialize Flatpickr
    fp = flatpickr("#daterange", {
        mode: "range",
        minDate: "today",
        dateFormat: "F j, Y",
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                dateFrom.value = instance.formatDate(selectedDates[0], "Y-m-d");
                dateTo.value = instance.formatDate(selectedDates[1], "Y-m-d");
                document.getElementById('daterange-err').classList.remove('show');
            } else if (selectedDates.length === 1) {
                dateFrom.value = instance.formatDate(selectedDates[0], "Y-m-d");
                dateTo.value = instance.formatDate(selectedDates[0], "Y-m-d");
            }
        }
    });

    const openBtn = document.getElementById('open-calendar');
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (fp) fp.open();
        });
    }

    daterangeEl.addEventListener('click', () => {
        if (fp) fp.open();
    });
    
    console.log("Flatpickr initialized successfully");
});

var bookingInfo;

// On number of guests change
function updateEstimatedBudget() {
    if (!attendees.value) return;
    
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
    let totalBudget = 1000 * servicesChecked * attendees.value
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
        validate('daterange','daterange-err'),
        validate('attendees','attendees-err'),
        validate('venue','venue-err'),
        validate('theme','theme-err')].every(Boolean);
        
    if (!ok) return;
    
    const submitBtn = document.getElementById('submit');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>Sending...</span>";
    submitBtn.style.pointerEvents = "none";
    
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
    submitBtn.innerHTML = "<span>Sending...</span>";
    submitBtn.disabled = true;
    DB.createBooking(JSON.parse(sessionStorage.getItem('bookingData'))); 
    sessionStorage.removeItem('bookingData');
};