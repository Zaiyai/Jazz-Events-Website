document.addEventListener('DOMContentLoaded', function () {

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: 'dayGridMonth',

    selectable: true,

    dateClick: function(info) {
      alert("You selected: " + info.dateStr);
    }

  });

  calendar.render();

});

document.addEventListener('DOMContentLoaded', function () {

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: 'dayGridMonth',

    events: [
      {
        title: "Booked",
        start: "2026-03-10",
        color: "red"
      },
      {
        title: "Booked",
        start: "2026-03-15",
        color: "red"
      }
    ],

    dateClick: function(info) {
      alert("You selected: " + info.dateStr);
    }

  });

  calendar.render();

});




