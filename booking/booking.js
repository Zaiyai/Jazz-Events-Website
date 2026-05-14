const today = new Date().toISOString().split('T')[0];
const eventBudget  = document.getElementById('event-budget');
const attendees    = document.getElementById('attendees');
const attendeesErr = document.getElementById('attendees-err')

const dateFrom     = document.getElementById('datefrom');
const dateTo       = document.getElementById('dateto');
if (dateFrom && dateTo) {
    dateFrom.setAttribute('min', today);
    dateTo.setAttribute('min', today);
}

var bookingInfo;

/** Per-guest rate (pesos) for each `name="service"` checkbox `value` in booking.html */
const SERVICE_BUDGET_RATES = {
    catering: 800,
    styling: 400,
    decoration: 200,
    lights: 200,
    sounds: 400,
    photography: 350,
    videography: 400,
    coordination: 500,
};


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
    }
}

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

function getEstimatedBudgetNumber() {
    const guests = Number(String(attendees.value).trim());
    if (!Number.isFinite(guests) || guests < 1 || guests > 99999) return null;
    let rateSum = 0;
    document.querySelectorAll('input[name="service"]:checked').forEach((el) => {
        rateSum += SERVICE_BUDGET_RATES[el.value] ?? 0;
    });
    return rateSum * guests;
}

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
    const totalBudget = getEstimatedBudgetNumber();
    if (totalBudget === null) return;
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
    submitBtn.innerHTML = "<span>Redirecting...</span>";
    submitBtn.style.pointerEvents = "none";
    
    const budgetAmount = getEstimatedBudgetNumber();
    eventBudget.innerHTML = budgetAmount !== null ? String(budgetAmount) : '';

    const user = await DB.getUser();

    const services = [...document.querySelectorAll('input[name="service"]:checked')].map(
        (el) => el.value
    );

    bookingInfo = {
        name:         document.getElementById('name').value.trim(),
        email:        document.getElementById('email').value.trim() || user.email,
        type:         document.getElementById('type').value.trim(),
        client_id:    user.user_id,
        date_from:    dateFrom.value,
        date_to:      dateTo.value,
        no_of_guests: attendees.value.trim(),
        venue:        document.getElementById('venue').value.trim(),
        theme:        document.getElementById('theme').value.trim(),
        status:       'PENDING',
        budget:       budgetAmount !== null ? budgetAmount : 0,
        phone_number: document.getElementById('phone').value.trim(),
        services,
    };
    
    await sessionStorage.setItem('bookingData', JSON.stringify(bookingInfo));
    setTimeout(()=>{window.location.href = "booking_summary.html";}, 1500);
}

// On form actual submission
function submitBooking() {
    const submitBtn = document.getElementsByClassName('confirm-btn')[0];
    submitBtn.innerHTML = "<span>Sending...</span>";
    submitBtn.disabled = true;
    DB.createBooking(JSON.parse(sessionStorage.getItem('bookingData'))); 
    sessionStorage.removeItem('bookingData');
};

document.addEventListener('DOMContentLoaded', () => {
    updateEstimatedBudget();
});